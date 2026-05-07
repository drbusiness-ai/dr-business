"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { LogOut, User, Bell, CreditCard, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setUser(data);
      });
  }, []);

  return (
    <AppShell activePath="/settings">
      <div className="max-w-3xl mx-auto pb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-[#1C1917] mb-2">Settings</h1>
          <p className="text-[#78716C] font-medium">Manage your account and preferences.</p>
        </header>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white border border-[#E8E4DC] rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center text-violet-600">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1C1917]">Profile</h3>
                <p className="text-[#78716C] text-sm font-medium">{user?.email || "Loading..."}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#1C1917] mb-2">Name</label>
                <input 
                  type="text" 
                  value={user?.name || ""} 
                  disabled
                  className="w-full bg-[#FAFAF7] border-2 border-[#E8E4DC] rounded-xl px-4 py-3 text-[#1C1917] font-semibold opacity-70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1C1917] mb-2">Skill</label>
                <input 
                  type="text" 
                  value={user?.skill || ""} 
                  disabled
                  className="w-full bg-[#FAFAF7] border-2 border-[#E8E4DC] rounded-xl px-4 py-3 text-[#1C1917] font-semibold opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-white border border-[#E8E4DC] rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-amber-500" />
              <h3 className="text-xl font-black text-[#1C1917]">Subscription</h3>
            </div>
            
            <div className="bg-[#FAFAF7] border border-[#E8E4DC] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="font-black text-[#1C1917] mb-1 text-lg">
                  {user?.plan === "FREE" ? "Free Plan" : `${user?.plan} Plan`}
                </p>
                <p className="text-sm font-medium text-[#78716C]">
                  Status: <span className={user?.planStatus === "ACTIVE" ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>{user?.planStatus || "INACTIVE"}</span>
                </p>
              </div>
              {user?.plan === "FREE" && (
                <Button className="bg-amber-500 hover:bg-amber-600 text-white font-bold" onClick={() => window.location.href = "/pricing"}>
                  Upgrade
                </Button>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white border-2 border-red-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-400" />
            <div className="flex items-center gap-3 mb-6 pl-2">
              <Shield className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-black text-[#1C1917]">Account Actions</h3>
            </div>
            
            <div className="pl-2">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200 font-bold"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
