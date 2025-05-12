type ICostOfWingman = {
  beginRank: string;
  endRank: string;
  server: string;
};

const costOfWingman = ({ beginRank, endRank, server }: ICostOfWingman) => {
  const listRates = [
    {
      name: "Asia",
      value: "AS",
      rates: [
        {
          code: "silver_1",
          name: "Silver 1",
          image: "SILVER_1__WINGAME",
          rate: 1,
        },
        {
          code: "silver_2",
          name: "Silver 2",
          image: "SILVER_2__WINGAME",
          rate: 1,
        },
        {
          code: "silver_3",
          name: "Silver 3",
          image: "SILVER_3__WINGAME",
          rate: 1,
        },
        {
          code: "silver_4",
          name: "Silver 4",
          image: "SILVER_4__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite",
          name: "Silver Elite",
          image: "SILVER_ELITE__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite_master",
          name: "Silver Elite Master",
          image: "SILVER_ELITE_MASTER__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_1",
          name: "Glob Nova 1",
          image: "GOLD_NOVA_1__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_2",
          name: "Glob Nova 2",
          image: "GOLD_NOVA_2__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_3",
          name: "Glob Nova 3",
          image: "GOLD_NOVA_3__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_master",
          name: "Glob Nova Master",
          image: "GOLD_NOVA_MASTER__WINGAME",
          rate: 1,
        },
        {
          code: "master_guardian_1",
          name: "Master Guardian 1",
          image: "MASTER_GUADIAN_1__WINGAME",
          rate: 1.5,
        },
        {
          code: "master_guardian_2",
          name: "Master Guardian 2",
          image: "MASTER_GUARDIAN_2__WINGAME",
          rate: 1.5,
        },
        {
          code: "master_guardian_elite",
          name: "Master Guardian Elite",
          image: "MASTER_GUARDIAN_ELITE__WINGAME",
          rate: 1.5,
        },
        {
          code: "distinguished_master_guardian",
          name: "Distinguished Master Guardian",
          image: "DISTINGUISHED__MASTER__GUARDIAN__WINGAME",
          rate: 2,
        },
        {
          code: "legendary_eagle",
          name: "Legendary Eagle",
          image: "LEGENDARY__EAGLE__WINGAME",
          rate: 2,
        },
        {
          code: "legendary_eagle_master",
          name: "Legendary Eagle Master",
          image: "LEGENDARY__EAGLE__MASTER__WINGAME",
          rate: 2,
        },
        {
          code: "supreme",
          name: "Supreme",
          image: "SUPREME__WINGAME",
          rate: 2,
        },
        {
          code: "global_elite",
          name: "Global Elite",
          image: "GLOBAL_ELITE__WINGAME",
          rate: 4,
        },
      ],
    },
    {
      name: "Australia",
      value: "AU",
      rates: [
        {
          code: "silver_1",
          name: "Silver 1",
          image: "SILVER_1__WINGAME",
          rate: 1,
        },
        {
          code: "silver_2",
          name: "Silver 2",
          image: "SILVER_2__WINGAME",
          rate: 1,
        },
        {
          code: "silver_3",
          name: "Silver 3",
          image: "SILVER_3__WINGAME",
          rate: 1,
        },
        {
          code: "silver_4",
          name: "Silver 4",
          image: "SILVER_4__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite",
          name: "Silver Elite",
          image: "SILVER_ELITE__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite_master",
          name: "Silver Elite Master",
          image: "SILVER_ELITE_MASTER__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_1",
          name: "Glob Nova 1",
          image: "GOLD_NOVA_1__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_2",
          name: "Glob Nova 2",
          image: "GOLD_NOVA_2__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_3",
          name: "Glob Nova 3",
          image: "GOLD_NOVA_3__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_master",
          name: "Glob Nova Master",
          image: "GOLD_NOVA_MASTER__WINGAME",
          rate: 1,
        },
        {
          code: "master_guardian_1",
          name: "Master Guardian 1",
          image: "MASTER_GUADIAN_1__WINGAME",
          rate: 1.5,
        },
        {
          code: "master_guardian_2",
          name: "Master Guardian 2",
          image: "MASTER_GUARDIAN_2__WINGAME",
          rate: 1.5,
        },
        {
          code: "master_guardian_elite",
          name: "Master Guardian Elite",
          image: "MASTER_GUARDIAN_ELITE__WINGAME",
          rate: 1.5,
        },
        {
          code: "distinguished_master_guardian",
          name: "Distinguished Master Guardian",
          image: "DISTINGUISHED__MASTER__GUARDIAN__WINGAME",
          rate: 2,
        },
        {
          code: "legendary_eagle",
          name: "Legendary Eagle",
          image: "LEGENDARY__EAGLE__WINGAME",
          rate: 2,
        },
        {
          code: "legendary_eagle_master",
          name: "Legendary Eagle Master",
          image: "LEGENDARY__EAGLE__MASTER__WINGAME",
          rate: 2,
        },
        {
          code: "supreme",
          name: "Supreme",
          image: "SUPREME__WINGAME",
          rate: 2,
        },
        {
          code: "global_elite",
          name: "Global Elite",
          image: "GLOBAL_ELITE__WINGAME",
          rate: 4,
        },
      ],
    },
    {
      name: "Africa",
      value: "AF",
      rates: [
        {
          code: "silver_1",
          name: "Silver 1",
          image: "SILVER_1__WINGAME",
          rate: 1,
        },
        {
          code: "silver_2",
          name: "Silver 2",
          image: "SILVER_2__WINGAME",
          rate: 1,
        },
        {
          code: "silver_3",
          name: "Silver 3",
          image: "SILVER_3__WINGAME",
          rate: 1,
        },
        {
          code: "silver_4",
          name: "Silver 4",
          image: "SILVER_4__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite",
          name: "Silver Elite",
          image: "SILVER_ELITE__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite_master",
          name: "Silver Elite Master",
          image: "SILVER_ELITE_MASTER__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_1",
          name: "Glob Nova 1",
          image: "GOLD_NOVA_1__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_2",
          name: "Glob Nova 2",
          image: "GOLD_NOVA_2__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_3",
          name: "Glob Nova 3",
          image: "GOLD_NOVA_3__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_master",
          name: "Glob Nova Master",
          image: "GOLD_NOVA_MASTER__WINGAME",
          rate: 1,
        },
        {
          code: "master_guardian_1",
          name: "Master Guardian 1",
          image: "MASTER_GUADIAN_1__WINGAME",
          rate: 1.5,
        },
        {
          code: "master_guardian_2",
          name: "Master Guardian 2",
          image: "MASTER_GUARDIAN_2__WINGAME",
          rate: 1.5,
        },
        {
          code: "master_guardian_elite",
          name: "Master Guardian Elite",
          image: "MASTER_GUARDIAN_ELITE__WINGAME",
          rate: 1.5,
        },
        {
          code: "distinguished_master_guardian",
          name: "Distinguished Master Guardian",
          image: "DISTINGUISHED__MASTER__GUARDIAN__WINGAME",
          rate: 2,
        },
        {
          code: "legendary_eagle",
          name: "Legendary Eagle",
          image: "LEGENDARY__EAGLE__WINGAME",
          rate: 2,
        },
        {
          code: "legendary_eagle_master",
          name: "Legendary Eagle Master",
          image: "LEGENDARY__EAGLE__MASTER__WINGAME",
          rate: 2,
        },
        {
          code: "supreme",
          name: "Supreme",
          image: "SUPREME__WINGAME",
          rate: 2,
        },
        {
          code: "global_elite",
          name: "Global Elite",
          image: "GLOBAL_ELITE__WINGAME",
          rate: 4,
        },
      ],
    },
    {
      name: "Europe",
      value: "EU",
      rates: [
        {
          code: "silver_1",
          name: "Silver 1",
          image: "SILVER_1__WINGAME",
          rate: 1,
        },
        {
          code: "silver_2",
          name: "Silver 2",
          image: "SILVER_2__WINGAME",
          rate: 1,
        },
        {
          code: "silver_3",
          name: "Silver 3",
          image: "SILVER_3__WINGAME",
          rate: 1,
        },
        {
          code: "silver_4",
          name: "Silver 4",
          image: "SILVER_4__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite",
          name: "Silver Elite",
          image: "SILVER_ELITE__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite_master",
          name: "Silver Elite Master",
          image: "SILVER_ELITE_MASTER__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_1",
          name: "Glob Nova 1",
          image: "GOLD_NOVA_1__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_2",
          name: "Glob Nova 2",
          image: "GOLD_NOVA_2__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_3",
          name: "Glob Nova 3",
          image: "GOLD_NOVA_3__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_master",
          name: "Glob Nova Master",
          image: "GOLD_NOVA_MASTER__WINGAME",
          rate: 1,
        },
        {
          code: "master_guardian_1",
          name: "Master Guardian 1",
          image: "MASTER_GUADIAN_1__WINGAME",
          rate: 1.5,
        },
        {
          code: "master_guardian_2",
          name: "Master Guardian 2",
          image: "MASTER_GUARDIAN_2__WINGAME",
          rate: 1.5,
        },
        {
          code: "master_guardian_elite",
          name: "Master Guardian Elite",
          image: "MASTER_GUARDIAN_ELITE__WINGAME",
          rate: 1.5,
        },
        {
          code: "distinguished_master_guardian",
          name: "Distinguished Master Guardian",
          image: "DISTINGUISHED__MASTER__GUARDIAN__WINGAME",
          rate: 2,
        },
        {
          code: "legendary_eagle",
          name: "Legendary Eagle",
          image: "LEGENDARY__EAGLE__WINGAME",
          rate: 2,
        },
        {
          code: "legendary_eagle_master",
          name: "Legendary Eagle Master",
          image: "LEGENDARY__EAGLE__MASTER__WINGAME",
          rate: 2,
        },
        {
          code: "supreme",
          name: "Supreme",
          image: "SUPREME__WINGAME",
          rate: 2,
        },
        {
          code: "global_elite",
          name: "Global Elite",
          image: "GLOBAL_ELITE__WINGAME",
          rate: 4,
        },
      ],
    },
    {
      name: "North America",
      value: "NA",
      rates: [
        {
          code: "silver_1",
          name: "Silver 1",
          image: "SILVER_1__WINGAME",
          rate: 1,
        },
        {
          code: "silver_2",
          name: "Silver 2",
          image: "SILVER_2__WINGAME",
          rate: 1,
        },
        {
          code: "silver_3",
          name: "Silver 3",
          image: "SILVER_3__WINGAME",
          rate: 1,
        },
        {
          code: "silver_4",
          name: "Silver 4",
          image: "SILVER_4__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite",
          name: "Silver Elite",
          image: "SILVER_ELITE__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite_master",
          name: "Silver Elite Master",
          image: "SILVER_ELITE_MASTER__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_1",
          name: "Glob Nova 1",
          image: "GOLD_NOVA_1__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_2",
          name: "Glob Nova 2",
          image: "GOLD_NOVA_2__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_3",
          name: "Glob Nova 3",
          image: "GOLD_NOVA_3__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_master",
          name: "Glob Nova Master",
          image: "GOLD_NOVA_MASTER__WINGAME",
          rate: 1,
        },
        {
          code: "master_guardian_1",
          name: "Master Guardian 1",
          image: "MASTER_GUADIAN_1__WINGAME",
          rate: 1.5,
        },
        {
          code: "master_guardian_2",
          name: "Master Guardian 2",
          image: "MASTER_GUARDIAN_2__WINGAME",
          rate: 1.5,
        },
        {
          code: "master_guardian_elite",
          name: "Master Guardian Elite",
          image: "MASTER_GUARDIAN_ELITE__WINGAME",
          rate: 1.5,
        },
        {
          code: "distinguished_master_guardian",
          name: "Distinguished Master Guardian",
          image: "DISTINGUISHED__MASTER__GUARDIAN__WINGAME",
          rate: 2,
        },
        {
          code: "legendary_eagle",
          name: "Legendary Eagle",
          image: "LEGENDARY__EAGLE__WINGAME",
          rate: 2,
        },
        {
          code: "legendary_eagle_master",
          name: "Legendary Eagle Master",
          image: "LEGENDARY__EAGLE__MASTER__WINGAME",
          rate: 2,
        },
        {
          code: "supreme",
          name: "Supreme",
          image: "SUPREME__WINGAME",
          rate: 2,
        },
        {
          code: "global_elite",
          name: "Global Elite",
          image: "GLOBAL_ELITE__WINGAME",
          rate: 4,
        },
      ],
    },
    {
      name: "South America",
      value: "SA",
      rates: [
        {
          code: "silver_1",
          name: "Silver 1",
          image: "SILVER_1__WINGAME",
          rate: 1,
        },
        {
          code: "silver_2",
          name: "Silver 2",
          image: "SILVER_2__WINGAME",
          rate: 1,
        },
        {
          code: "silver_3",
          name: "Silver 3",
          image: "SILVER_3__WINGAME",
          rate: 1,
        },
        {
          code: "silver_4",
          name: "Silver 4",
          image: "SILVER_4__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite",
          name: "Silver Elite",
          image: "SILVER_ELITE__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite_master",
          name: "Silver Elite Master",
          image: "SILVER_ELITE_MASTER__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_1",
          name: "Glob Nova 1",
          image: "GOLD_NOVA_1__WINGAME",
          rate: 1.5,
        },
        {
          code: "glob_nova_2",
          name: "Glob Nova 2",
          image: "GOLD_NOVA_2__WINGAME",
          rate: 1.5,
        },
        {
          code: "glob_nova_3",
          name: "Glob Nova 3",
          image: "GOLD_NOVA_3__WINGAME",
          rate: 1.5,
        },
        {
          code: "glob_nova_master",
          name: "Glob Nova Master",
          image: "GOLD_NOVA_MASTER__WINGAME",
          rate: 1.5,
        },
        {
          code: "master_guardian_1",
          name: "Master Guardian 1",
          image: "MASTER_GUADIAN_1__WINGAME",
          rate: 2,
        },
        {
          code: "master_guardian_2",
          name: "Master Guardian 2",
          image: "MASTER_GUARDIAN_2__WINGAME",
          rate: 2,
        },
        {
          code: "master_guardian_elite",
          name: "Master Guardian Elite",
          image: "MASTER_GUARDIAN_ELITE__WINGAME",
          rate: 2,
        },
        {
          code: "distinguished_master_guardian",
          name: "Distinguished Master Guardian",
          image: "DISTINGUISHED__MASTER__GUARDIAN__WINGAME",
          rate: 4,
        },
        {
          code: "legendary_eagle",
          name: "Legendary Eagle",
          image: "LEGENDARY__EAGLE__WINGAME",
          rate: 4,
        },
        {
          code: "legendary_eagle_master",
          name: "Legendary Eagle Master",
          image: "LEGENDARY__EAGLE__MASTER__WINGAME",
          rate: 4,
        },
        {
          code: "supreme",
          name: "Supreme",
          image: "SUPREME__WINGAME",
          rate: 4,
        },
        {
          code: "global_elite",
          name: "Global Elite",
          image: "GLOBAL_ELITE__WINGAME",
          rate: 8,
        },
      ],
    },
    {
      name: "China",
      value: "CN",
      rates: [
        {
          code: "silver_1",
          name: "Silver 1",
          image: "SILVER_1__WINGAME",
          rate: 1,
        },
        {
          code: "silver_2",
          name: "Silver 2",
          image: "SILVER_2__WINGAME",
          rate: 1,
        },
        {
          code: "silver_3",
          name: "Silver 3",
          image: "SILVER_3__WINGAME",
          rate: 1,
        },
        {
          code: "silver_4",
          name: "Silver 4",
          image: "SILVER_4__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite",
          name: "Silver Elite",
          image: "SILVER_ELITE__WINGAME",
          rate: 1,
        },
        {
          code: "silver_elite_master",
          name: "Silver Elite Master",
          image: "SILVER_ELITE_MASTER__WINGAME",
          rate: 1,
        },
        {
          code: "glob_nova_1",
          name: "Glob Nova 1",
          image: "GOLD_NOVA_1__WINGAME",
          rate: 1.5,
        },
        {
          code: "glob_nova_2",
          name: "Glob Nova 2",
          image: "GOLD_NOVA_2__WINGAME",
          rate: 1.5,
        },
        {
          code: "glob_nova_3",
          name: "Glob Nova 3",
          image: "GOLD_NOVA_3__WINGAME",
          rate: 1.5,
        },
        {
          code: "glob_nova_master",
          name: "Glob Nova Master",
          image: "GOLD_NOVA_MASTER__WINGAME",
          rate: 1.5,
        },
        {
          code: "master_guardian_1",
          name: "Master Guardian 1",
          image: "MASTER_GUADIAN_1__WINGAME",
          rate: 2,
        },
        {
          code: "master_guardian_2",
          name: "Master Guardian 2",
          image: "MASTER_GUARDIAN_2__WINGAME",
          rate: 2,
        },
        {
          code: "master_guardian_elite",
          name: "Master Guardian Elite",
          image: "MASTER_GUARDIAN_ELITE__WINGAME",
          rate: 2,
        },
        {
          code: "distinguished_master_guardian",
          name: "Distinguished Master Guardian",
          image: "DISTINGUISHED__MASTER__GUARDIAN__WINGAME",
          rate: 4,
        },
        {
          code: "legendary_eagle",
          name: "Legendary Eagle",
          image: "LEGENDARY__EAGLE__WINGAME",
          rate: 4,
        },
        {
          code: "legendary_eagle_master",
          name: "Legendary Eagle Master",
          image: "LEGENDARY__EAGLE__MASTER__WINGAME",
          rate: 4,
        },
        {
          code: "supreme",
          name: "Supreme",
          image: "SUPREME__WINGAME",
          rate: 4,
        },
        {
          code: "global_elite",
          name: "Global Elite",
          image: "GLOBAL_ELITE__WINGAME",
          rate: 8,
        },
      ],
    },
  ];

  // (Đơn giá 10000đ = 1 Point)
  const unitPrice = 10000;

  // Tìm server hiện tại
  const selectedServer = listRates.find((s) => s.value === server);

  if (selectedServer) {
    // Lấy idx của beginRank và endRank trong mảng listRates
    const currentIdx = selectedServer.rates.findIndex(
      (r) => r.code === beginRank,
    );

    const desiredIdx = selectedServer.rates.findIndex(
      (r) => r.code === endRank,
    );

    if (currentIdx !== -1 && desiredIdx !== -1) {
      // Tính giá trị dựa trên rate
      const currentRate = selectedServer.rates
        .slice(0, currentIdx + 1)
        .reduce((sum, rank) => sum + rank.rate, 0);

      const desiredRate = selectedServer.rates
        .slice(0, desiredIdx + 1)
        .reduce((sum, rank) => sum + rank.rate, 0);

      if (currentRate > 0 && desiredRate > 0) {
        // Đơn giá cho một điểm = điểm rating * đơn giá * điểm bonus
        const totalCost = (desiredRate - currentRate) * unitPrice;
        return totalCost;
      }
    }
  }

  // Nếu không tìm thấy server
  return -1;
};

export default costOfWingman;
