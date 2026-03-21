import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return res.status(500).json({ error: "ลืมใส่ URL หรือ Key ในไฟล์ .env.local หรือเปล่าครับ?" });
  }

  try {
    // ยิง Request ไปขอ OpenAPI Schema จาก Supabase ของคุณ
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${anonKey}`);
    const data = await response.json();

    // เจาะหาเฉพาะโครงสร้างของตาราง promotions
    const promotionsSchema = data.definitions?.promotions?.properties;

    if (promotionsSchema) {
      // ถ้าเจอ จะส่งรายชื่อคอลัมน์ทั้งหมดกลับไปให้ดูครับ
      return res.status(200).json({
        message: "เจอโครงสร้างตาราง promotions แล้วครับ!",
        columns: Object.keys(promotionsSchema),
        details: promotionsSchema // แถบรายละเอียดประเภทข้อมูล (Text, Number, Date)
      });
    } else {
      return res.status(404).json({ error: "ไม่พบตาราง promotions ในระบบครับ (แน่ใจนะว่าเพื่อนสร้างไว้แล้ว?)" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}