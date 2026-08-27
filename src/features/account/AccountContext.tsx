import React, { createContext, useContext, useEffect, useState } from 'react';

export type MembershipTier = 'free' | 'pro';

export interface LoyaltyActivity {
  id: string;
  title: string;
  type: 'xp_earned' | 'coins_earned' | 'coins_spent';
  amount: number;
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  atelierId: string;
  aesthetic: string;
  palette: string;
  outerwearSize: string;
  tailoringSize: string;
  footwearSize: string;
  currency: string;
  region: string;
  aiLearning: boolean;
  notifications: {
    orders: boolean;
    promotions: boolean;
    styling: boolean;
    concierge: boolean;
  };
}

export interface AccountContextType {
  membership: MembershipTier;
  profile: UserProfile;
  xp: number;
  coins: number;
  level: string;
  nextXp: number;
  loyaltyHistory: LoyaltyActivity[];
  dailyAiCount: number;
  monthlyAiCount: number;
  canUseAi: boolean;
  upgradeMembership: () => void;
  downgradeMembership: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  incrementAiUsage: () => boolean;
  addXp: (amount: number, reason: string) => void;
  spendCoins: (amount: number, rewardTitle: string) => boolean;
}

const defaultProfile: UserProfile = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  atelierId: 'FX-MBR-8492',
  aesthetic: 'Quiet structure',
  palette: 'Monochrome',
  outerwearSize: 'M (Medium)',
  tailoringSize: '38R / EU 48',
  footwearSize: '39 EU / 8.5 US',
  currency: 'USD ($)',
  region: 'Global Express',
  aiLearning: true,
  notifications: {
    orders: true,
    promotions: false,
    styling: true,
    concierge: true,
  },
};

const defaultHistory: LoyaltyActivity[] = [
  { id: '1', title: 'Commission of Obsidian Wool Coat', type: 'xp_earned', amount: 148, date: '2026-08-25' },
  { id: '2', title: 'Completed Falcon AI Styling Consultation', type: 'xp_earned', amount: 50, date: '2026-08-24' },
  { id: '3', title: 'Daily Atelier Check-in Bonus', type: 'coins_earned', amount: 20, date: '2026-08-24' },
  { id: '4', title: 'Signature Capsule Curation', type: 'xp_earned', amount: 100, date: '2026-08-20' },
];

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const FREE_DAILY_LIMIT = 3;
export const FREE_MONTHLY_LIMIT = 50;

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Membership state
  const [membership, setMembership] = useState<MembershipTier>(() => {
    try {
      const saved = localStorage.getItem('falcon_membership');
      return (saved as MembershipTier) || 'free';
    } catch {
      return 'free';
    }
  });

  // User Profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('falcon_settings');
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  // Loyalty XP & Coins state
  const [xp, setXp] = useState<number>(1840);
  const [coins, setCoins] = useState<number>(320);
  const [level, setLevel] = useState<string>('Level 04');
  const [nextXp, setNextXp] = useState<number>(2400);
  const [loyaltyHistory, setLoyaltyHistory] = useState<LoyaltyActivity[]>(defaultHistory);

  // AI Usage Tracking
  const [dailyAiCount, setDailyAiCount] = useState<number>(1);
  const [monthlyAiCount, setMonthlyAiCount] = useState<number>(8);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('falcon_membership', membership);
    } catch (e) {
      console.error('Failed to save membership state', e);
    }
  }, [membership]);

  useEffect(() => {
    try {
      localStorage.setItem('falcon_settings', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile settings', e);
    }
  }, [profile]);

  // AI usage limit check
  const canUseAi = membership === 'pro' || (dailyAiCount < FREE_DAILY_LIMIT && monthlyAiCount < FREE_MONTHLY_LIMIT);

  const incrementAiUsage = (): boolean => {
    if (membership === 'pro') return true;
    if (dailyAiCount >= FREE_DAILY_LIMIT || monthlyAiCount >= FREE_MONTHLY_LIMIT) {
      return false;
    }
    setDailyAiCount((prev) => prev + 1);
    setMonthlyAiCount((prev) => prev + 1);
    return true;
  };

  const upgradeMembership = () => {
    setMembership('pro');
  };

  const downgradeMembership = () => {
    setMembership('free');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const addXp = (amount: number, reason: string) => {
    setXp((prev) => prev + amount);
    const newEntry: LoyaltyActivity = {
      id: Date.now().toString(),
      title: reason,
      type: 'xp_earned',
      amount,
      date: new Date().toISOString().split('T')[0],
    };
    setLoyaltyHistory((prev) => [newEntry, ...prev]);
  };

  const spendCoins = (amount: number, rewardTitle: string): boolean => {
    if (coins < amount) return false;
    setCoins((prev) => prev - amount);
    const newEntry: LoyaltyActivity = {
      id: Date.now().toString(),
      title: `Redeemed: ${rewardTitle}`,
      type: 'coins_spent',
      amount,
      date: new Date().toISOString().split('T')[0],
    };
    setLoyaltyHistory((prev) => [newEntry, ...prev]);
    return true;
  };

  return (
    <AccountContext.Provider
      value={{
        membership,
        profile,
        xp,
        coins,
        level,
        nextXp,
        loyaltyHistory,
        dailyAiCount,
        monthlyAiCount,
        canUseAi,
        upgradeMembership,
        downgradeMembership,
        updateProfile,
        incrementAiUsage,
        addXp,
        spendCoins,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
