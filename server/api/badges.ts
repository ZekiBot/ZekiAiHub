import { Request, Response } from "express";
import { storage } from "../storage";
import { db } from "../db";
import { userBadges, users } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Kullanıcının rozet durumunu getir
 */
export async function getUserBadges(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    
    // Kullanıcı mevcut mu kontrol et
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    
    // Rozet durumunu getir
    return res.json({ badges: user.badges || {
      explorer: 0,
      learner: 0,
      master: 0,
      collector: 0,
      translator: 0
    }});
  } catch (error) {
    console.error("Error fetching user badges:", error);
    return res.status(500).json({ error: "Rozet bilgileri alınamadı" });
  }
}

/**
 * Rozet ilerleme durumunu güncelle
 * 
 * Kullanıcının bir rozet tipindeki ilerlemesini arttırır ve
 * gerekli değere ulaşıldığında rozet kazanıldığını kaydeder.
 */
export async function updateBadgeProgress(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { badgeType, increment = 1 } = req.body;
    
    if (!badgeType) {
      return res.status(400).json({ error: "Rozet tipi belirtilmedi" });
    }
    
    // Kullanıcıyı bul
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    
    // Mevcut rozet durumunu al veya yeni oluştur
    const currentBadges = user.badges || {
      explorer: 0,
      learner: 0,
      master: 0,
      collector: 0,
      translator: 0
    };
    
    // Rozet ilerlemesini güncelle
    const updatedBadges = {
      ...currentBadges,
      [badgeType]: (currentBadges[badgeType as keyof typeof currentBadges] || 0) + increment
    };
    
    // Kullanıcı rozet durumunu güncelle
    await db.update(users)
      .set({ badges: updatedBadges })
      .where(eq(users.id, userId));
    
    return res.json({ 
      success: true, 
      badges: updatedBadges
    });
  } catch (error) {
    console.error("Error updating badge progress:", error);
    return res.status(500).json({ error: "Rozet ilerleme durumu güncellenemedi" });
  }
}

/**
 * Rozet kazanımını kaydet
 * 
 * Kullanıcı bir rozette gerekli seviyeye ulaştığında
 * bu rozeti kazandığını veritabanına kaydeder.
 */
export async function earnBadge(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { badgeType, level } = req.body;
    
    if (!badgeType || !level) {
      return res.status(400).json({ error: "Rozet tipi veya seviyesi belirtilmedi" });
    }
    
    // Kullanıcı mevcut mu kontrol et
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    
    // Bu rozeti daha önce kazanmış mı kontrol et
    const existingBadge = await db.query.userBadges.findFirst({
      where: (b) => 
        eq(userBadges.userId, userId) && 
        eq(userBadges.badgeType, badgeType) && 
        eq(userBadges.level, level)
    });
    
    if (existingBadge) {
      return res.json({ 
        success: true, 
        alreadyEarned: true,
        badge: existingBadge 
      });
    }
    
    // Yeni rozet kaydı oluştur
    const newBadge = await db.insert(userBadges).values({
      userId,
      badgeType,
      level,
    }).returning();
    
    return res.json({ 
      success: true, 
      badge: newBadge[0]
    });
  } catch (error) {
    console.error("Error earning badge:", error);
    return res.status(500).json({ error: "Rozet kazanımı kaydedilemedi" });
  }
}