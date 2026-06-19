"use client";

import { useState } from "react";
import { createLead } from "@/app/actions/lead-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

const DISTRICTS = [
  "Quận 1",
  "Quận 3",
  "Quận 10",
  "Bình Thạnh",
  "Gò Vấp",
  "Tân Bình",
  "Thủ Đức",
];

export default function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("Quận 10");
  const [budget, setBudget] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const parsedBudget = parseInt(budget.replace(/\D/g, ""), 10);
    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      setError("Vui lòng nhập ngân sách hợp lệ");
      setLoading(false);
      return;
    }

    const res = await createLead({
      name,
      phone,
      district,
      budget: parsedBudget,
      note,
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setName("");
      setPhone("");
      setBudget("");
      setNote("");
    } else {
      setError(res.error || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
    }
  };

  const formatBudgetInput = (val: string) => {
    const numeric = val.replace(/\D/g, "");
    if (!numeric) return "";
    return parseInt(numeric, 10).toLocaleString("vi-VN") + " đ";
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const numericVal = rawVal.replace(/\D/g, "");
    setBudget(numericVal ? formatBudgetInput(numericVal) : "");
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white border-2 border-border-olive p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
      {/* Decorative Warm Accent top line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-terracotta" />

      {success ? (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-olive/10 text-olive">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-xl font-black text-foreground">
            Đăng Ký Thành Công!
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Yêu cầu tư vấn tìm phòng của bạn đã được tiếp nhận. Đội ngũ Uni Living
            sẽ liên hệ hỗ trợ bạn qua điện thoại/Zalo trong thời gian sớm nhất!
          </p>
          <Button
            onClick={() => setSuccess(false)}
            variant="outline"
            className="mt-6 border-border-olive hover:border-olive rounded-full"
          >
            Đăng ký yêu cầu mới
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-black text-foreground flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="h-5 w-5 text-terracotta" />
              Đăng Ký Tư Vấn Tìm Phòng
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Bạn bận rộn? Hãy để Uni Living tìm phòng trọ/căn hộ dịch vụ ưng ý nhất
              cho bạn hoàn toàn miễn phí!
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-bold text-foreground">
              Họ tên của bạn *
            </Label>
            <Input
              id="name"
              type="text"
              required
              placeholder="Ví dụ: Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-border-olive focus-visible:ring-olive"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-bold text-foreground">
                Số điện thoại / Zalo *
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                placeholder="Ví dụ: 0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border-border-olive focus-visible:ring-olive"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="budget" className="text-xs font-bold text-foreground">
                Ngân sách tối đa *
              </Label>
              <Input
                id="budget"
                type="text"
                required
                placeholder="Ví dụ: 5.000.000 đ"
                value={budget}
                onChange={handleBudgetChange}
                className="rounded-xl border-border-olive focus-visible:ring-olive"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="district" className="text-xs font-bold text-foreground">
              Khu vực mong muốn *
            </Label>
            <select
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note" className="text-xs font-bold text-foreground">
              Ghi chú thêm (Tiện ích mong muốn, số người ở...)
            </Label>
            <Textarea
              id="note"
              placeholder="Ví dụ: Phòng có ban công, cho nuôi mèo, ở 2 người..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-xl border-border-olive focus-visible:ring-olive min-h-[80px]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-olive hover:bg-olive-hover text-white font-bold rounded-full py-6 transition-all hover:scale-[1.01] cursor-pointer"
          >
            {loading ? "Đang gửi..." : "Gửi yêu cầu ngay"}
          </Button>
        </form>
      )}
    </div>
  );
}
