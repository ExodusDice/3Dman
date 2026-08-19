import { Resend } from 'resend';
import { CustomerOrder } from '@/types';
import { formatCurrency } from './pricing';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const fromEmail = process.env.FROM_EMAIL || '3DMan Thailand <orders@3dman.studio>';

export async function sendOrderConfirmationEmail(order: CustomerOrder) {
  const subject = `[3DMan] ยืนยันคำสั่งซื้อ #${order.orderNumber} - รอการตรวจสอบแบบ 3D และ SLA`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
      <div style="text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
        <h2 style="color: #6366f1; margin: 0;">3DMan Thailand</h2>
        <p style="font-size: 12px; color: #64748b; margin-top: 4px;">บริการสร้างโมเดล 3D ด้วย AI & พิมพ์ชิ้นงานจริง</p>
      </div>

      <div style="padding: 16px 0;">
        <h3 style="color: #0f172a;">สวัสดีคุณ ${order.customerName},</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          เราได้รับคำสั่งซื้อ 3D ของคุณเรียบร้อยแล้ว! วิศวกรของเรากำลังตรวจสอบการสไลซ์ไฟล์และตำแหน่งเสาค้ำ Support เพื่อความสมบูรณ์แบบ
        </p>

        <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin: 16px 0; border: 1px solid #e2e8f0;">
          <table style="width: 100%; font-size: 13px;">
            <tr>
              <td style="color: #64748b;">รหัสคำสั่งซื้อ:</td>
              <td style="font-weight: bold; text-align: right;">#${order.orderNumber}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">คำสั่ง (Prompt):</td>
              <td style="font-style: italic; text-align: right;">"${order.prompt}"</td>
            </tr>
            <tr>
              <td style="color: #64748b;">วัสดุ:</td>
              <td style="text-align: right; color: #6366f1; font-weight: bold;">${order.material.name}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">ขนาดความสูง:</td>
              <td style="text-align: right;">${order.modelGeometry.heightCm} ซม.</td>
            </tr>
            <tr>
              <td style="color: #64748b;">ยอดเงินมัดจำประเมิน:</td>
              <td style="text-align: right; font-size: 16px; font-weight: bold; color: #0f172a;">${formatCurrency(order.pricing.totalPrice)}</td>
            </tr>
          </table>
        </div>

        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 12px; margin: 16px 0; color: #065f46; font-size: 12px;">
          <strong>🛡️ การรับประกัน SLA 14 วัน:</strong> จัดส่งถึงบ้านภายใน 14 วันทำการหลังจากอนุมัติ หรือรับเงินคืน 100% เต็มจำนวน
        </div>

        <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
          * คุณสามารถขอยกเลิกและรับเงินคืน 100% ได้ตลอดเวลาก่อนเริ่มกระบวนการพิมพ์ชิ้นงาน 3D
        </p>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/orders/${order.id}" 
             style="display: inline-block; background: #6366f1; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; font-size: 13px;">
            ติดตามสถานะคำสั่งซื้อในระบบ
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8;">
        © 3DMan Thailand Co., Ltd. สงวนลิขสิทธิ์
      </div>
    </div>
  `;

  if (!resend) {
    console.log(`[Resend Email Mock] Order Confirmation sent to ${order.customerEmail} (${subject})`);
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: [order.customerEmail],
      subject,
      html,
    });
    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to send email via Resend:', err);
    return { success: false, error: err.message };
  }
}

export async function sendSlaApprovalEmail(order: CustomerOrder) {
  const subject = `[3DMan] อนุมัติแบบและยืนยันราคาจริง/SLA สำหรับคำสั่งซื้อ #${order.orderNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
      <h2 style="color: #6366f1; margin: 0;">3DMan Thailand</h2>
      <p style="font-size: 14px; margin-top: 16px;">
        สวัสดีคุณ ${order.customerName},<br/><br/>
        วิศวกร 3D ได้สไลซ์ไฟล์และตรวจสอบโครงสร้างคำสั่งซื้อ <strong>#${order.orderNumber}</strong> เรียบร้อยแล้ว ชิ้นงานเข้าสู่คิวการพิมพ์แล้วครับ!
      </p>

      <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin: 16px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 13px;"><strong>ราคาสุทธิ:</strong> ${formatCurrency(order.actualPrice || order.pricing.totalPrice)}</p>
        <p style="margin: 4px 0 0; font-size: 13px;"><strong>กำหนดส่งถึงบ้านภายใน:</strong> ${new Date(order.slaGuaranteedDeliveryDate).toLocaleDateString('th-TH')}</p>
        <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;"><em>"${order.adminApprovalNotes || 'อนุมัติโครงสร้างตาข่ายความละเอียดสูง'}"</em></p>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/orders/${order.id}" 
           style="display: inline-block; background: #06b6d4; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-weight: bold; font-size: 12px;">
          ดูความคืบหน้าการพิมพ์สด
        </a>
      </div>
    </div>
  `;

  if (!resend) {
    console.log(`[Resend Email Mock] SLA Approval sent to ${order.customerEmail}`);
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: [order.customerEmail],
      subject,
      html,
    });
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendShippingTrackingEmail(order: CustomerOrder) {
  const subject = `[3DMan] ชิ้นงาน 3D ของคุณจัดส่งแล้ว! เลขพัสดุ ${order.trackingNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
      <h2 style="color: #6366f1; margin: 0;">3DMan Thailand</h2>
      <p style="font-size: 14px; margin-top: 16px;">
        สวัสดีคุณ ${order.customerName},<br/><br/>
        ชิ้นงานประติมากรรม 3D ของคุณผ่านการอบแสง UV ขัดแต่งด้วยมือ และบรรจุลงกล่องกันกระแทกเรียบร้อย พร้อมส่งมอบให้บริษัทขนส่งแล้วครับ!
      </p>

      <div style="background: #f0fdf4; border-radius: 12px; padding: 16px; margin: 16px 0; border: 1px solid #bbf7d0;">
        <p style="margin: 0; font-size: 13px;"><strong>บริษัทขนส่ง:</strong> ${order.trackingCarrier || 'Flash Express / Kerry'}</p>
        <p style="margin: 4px 0 0; font-size: 15px; font-family: monospace; font-weight: bold; color: #15803d;">เลขพัสดุ: ${order.trackingNumber}</p>
      </div>

      <p style="font-size: 13px; color: #475569;">
        เมื่อได้รับพัสดุแล้ว กรุณาเข้าสู่ระบบเพื่อกด <strong>"ยืนยันรับสินค้า & ตรงตามแบบ"</strong> เพื่อเสร็จสิ้นคำสั่งซื้อนะครับ
      </p>
    </div>
  `;

  if (!resend) {
    console.log(`[Resend Email Mock] Tracking Email sent to ${order.customerEmail} (${order.trackingNumber})`);
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: [order.customerEmail],
      subject,
      html,
    });
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
