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
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences.</p>
        </header>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-[#111118] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Profile</h3>
                <p className="text-slate-400 text-sm">{user?.email || "Loading..."}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                <input 
                  type="text" 
                  value={user?.name || ""} 
                  disabled
                  className="w-full bg-[#0a0a0f] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 opacity-70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Skill</label>
                <input 
                  type="text" 
                  value={user?.skill || ""} 
                  disabled
                  className="w-full bg-[#0a0a0f] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-[#111118] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-medium text-white">Subscription</h3>
            </div>
            
            <div className="bg-[#0a0a0f] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-white mb-1">
                  {user?.plan === "FREE" ? "Free Plan" : `${user?.plan} Plan`}
                </p>
                <p className="text-sm text-slate-400">
                  Status: <span className={user?.planStatus === "ACTIVE" ? "text-green-400" : "text-yellow-400"}>{user?.planStatus || "INACTIVE"}</span>
                </p>
              </div>
              {user?.plan === "FREE" && (
                <Button variant="primary" onClick={() => window.location.href = "/pricing"}>
                  Upgrade
                </Button>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#111118] border border-red-900/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-medium text-white">Account Actions</h3>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full sm:w-auto flex items-center gap-2 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 border border-red-900/50"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
