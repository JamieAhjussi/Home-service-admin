import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ==========================================
  // 1. ดึงข้อมูลโปรโมชัน (GET)
  // ==========================================
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // ==========================================
  // 2. สร้างโปรโมชันใหม่ (POST)
  // ==========================================
  if (req.method === "POST") {
    try {
      // รับค่าตรงๆ จากหน้า Add Promotion
      const { code, type, discount_value, usage_limit, expiry_date } = req.body;

      const { data, error } = await supabase
        .from("promotions")
        .insert([
          {
            code: code,
            type: type,
            discount_value: discount_value,
            usage_limit: usage_limit,
            used_count: 0,
            expiry_date: expiry_date,
            active: true // เปิดใช้งานโค้ดทันที
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    } catch (error: any) {
      if (error.code === '23505') {
        return res.status(400).json({ error: "ชื่อ Promotion Code นี้มีในระบบแล้ว" });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}