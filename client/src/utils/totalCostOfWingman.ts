export const totalCostOfWingman = (
  currentRank: string,
  desiredRank: string,
  server: string,
): number => {
  const servers = [
    {
      name: "AF",
      costs: [
        {
          name: "silver_1",
          bonus: 1,
        },
        {
          name: "silver_2",
          bonus: 1,
        },
        {
          name: "silver_3",
          bonus: 1,
        },
        {
          name: "silver_4",
          bonus: 1,
        },
        {
          name: "silver_elite",
          bonus: 1,
        },
        {
          name: "silver_elite_master",
          bonus: 1,
        },
        {
          name: "glob_nova_1",
          bonus: 1,
        },
        {
          name: "glob_nova_2",
          bonus: 1,
        },
        {
          name: "glob_nova_3",
          bonus: 1,
        },
        {
          name: "glob_nova_master",
          bonus: 1,
        },
        {
          name: "master_guardian_1",
          bonus: 1.5,
        },
        {
          name: "master_guardian_2",
          bonus: 1.5,
        },
        {
          name: "master_guardian_elite",
          bonus: 1.5,
        },
        {
          name: "distinguished_master_guardian",
          bonus: 2,
        },
        {
          name: "legendary_eagle",
          bonus: 2,
        },
        {
          name: "legendary_eagle_master",
          bonus: 2,
        },
        {
          name: "supreme",
          bonus: 2,
        },
        {
          name: "global_elite",
          bonus: 4,
        },
      ],
    },
    {
      name: "AU",
      costs: [
        {
          name: "silver_1",
          bonus: 1,
        },
        {
          name: "silver_2",
          bonus: 1,
        },
        {
          name: "silver_3",
          bonus: 1,
        },
        {
          name: "silver_4",
          bonus: 1,
        },
        {
          name: "silver_elite",
          bonus: 1,
        },
        {
          name: "silver_elite_master",
          bonus: 1,
        },
        {
          name: "glob_nova_1",
          bonus: 1,
        },
        {
          name: "glob_nova_2",
          bonus: 1,
        },
        {
          name: "glob_nova_3",
          bonus: 1,
        },
        {
          name: "glob_nova_master",
          bonus: 1,
        },
        {
          name: "master_guardian_1",
          bonus: 1.5,
        },
        {
          name: "master_guardian_2",
          bonus: 1.5,
        },
        {
          name: "master_guardian_elite",
          bonus: 1.5,
        },
        {
          name: "distinguished_master_guardian",
          bonus: 2,
        },
        {
          name: "legendary_eagle",
          bonus: 2,
        },
        {
          name: "legendary_eagle_master",
          bonus: 2,
        },
        {
          name: "supreme",
          bonus: 2,
        },
        {
          name: "global_elite",
          bonus: 4,
        },
      ],
    },
    {
      name: "EU",
      costs: [
        {
          name: "silver_1",
          bonus: 1,
        },
        {
          name: "silver_2",
          bonus: 1,
        },
        {
          name: "silver_3",
          bonus: 1,
        },
        {
          name: "silver_4",
          bonus: 1,
        },
        {
          name: "silver_elite",
          bonus: 1,
        },
        {
          name: "silver_elite_master",
          bonus: 1,
        },
        {
          name: "glob_nova_1",
          bonus: 1,
        },
        {
          name: "glob_nova_2",
          bonus: 1,
        },
        {
          name: "glob_nova_3",
          bonus: 1,
        },
        {
          name: "glob_nova_master",
          bonus: 1,
        },
        {
          name: "master_guardian_1",
          bonus: 1.5,
        },
        {
          name: "master_guardian_2",
          bonus: 1.5,
        },
        {
          name: "master_guardian_elite",
          bonus: 1.5,
        },
        {
          name: "distinguished_master_guardian",
          bonus: 2,
        },
        {
          name: "legendary_eagle",
          bonus: 2,
        },
        {
          name: "legendary_eagle_master",
          bonus: 2,
        },
        {
          name: "supreme",
          bonus: 2,
        },
        {
          name: "global_elite",
          bonus: 4,
        },
      ],
    },
    {
      name: "NA",
      costs: [
        {
          name: "silver_1",
          bonus: 1,
        },
        {
          name: "silver_2",
          bonus: 1,
        },
        {
          name: "silver_3",
          bonus: 1,
        },
        {
          name: "silver_4",
          bonus: 1,
        },
        {
          name: "silver_elite",
          bonus: 1,
        },
        {
          name: "silver_elite_master",
          bonus: 1,
        },
        {
          name: "glob_nova_1",
          bonus: 1,
        },
        {
          name: "glob_nova_2",
          bonus: 1,
        },
        {
          name: "glob_nova_3",
          bonus: 1,
        },
        {
          name: "glob_nova_master",
          bonus: 1,
        },
        {
          name: "master_guardian_1",
          bonus: 1.5,
        },
        {
          name: "master_guardian_2",
          bonus: 1.5,
        },
        {
          name: "master_guardian_elite",
          bonus: 1.5,
        },
        {
          name: "distinguished_master_guardian",
          bonus: 2,
        },
        {
          name: "legendary_eagle",
          bonus: 2,
        },
        {
          name: "legendary_eagle_master",
          bonus: 2,
        },
        {
          name: "supreme",
          bonus: 2,
        },
        {
          name: "global_elite",
          bonus: 4,
        },
      ],
    },
    {
      name: "SA",
      costs: [
        {
          name: "silver_1",
          bonus: 1,
        },
        {
          name: "silver_2",
          bonus: 1,
        },
        {
          name: "silver_3",
          bonus: 1,
        },
        {
          name: "silver_4",
          bonus: 1,
        },
        {
          name: "silver_elite",
          bonus: 1,
        },
        {
          name: "silver_elite_master",
          bonus: 1,
        },
        {
          name: "glob_nova_1",
          bonus: 1,
        },
        {
          name: "glob_nova_2",
          bonus: 1,
        },
        {
          name: "glob_nova_3",
          bonus: 1,
        },
        {
          name: "glob_nova_master",
          bonus: 1,
        },
        {
          name: "master_guardian_1",
          bonus: 1.5,
        },
        {
          name: "master_guardian_2",
          bonus: 1.5,
        },
        {
          name: "master_guardian_elite",
          bonus: 1.5,
        },
        {
          name: "distinguished_master_guardian",
          bonus: 2,
        },
        {
          name: "legendary_eagle",
          bonus: 2,
        },
        {
          name: "legendary_eagle_master",
          bonus: 2,
        },
        {
          name: "supreme",
          bonus: 2,
        },
        {
          name: "global_elite",
          bonus: 4,
        },
      ],
    },
    {
      name: "AS",
      costs: [
        {
          name: "silver_1",
          bonus: 1,
        },
        {
          name: "silver_2",
          bonus: 1,
        },
        {
          name: "silver_3",
          bonus: 1,
        },
        {
          name: "silver_4",
          bonus: 1,
        },
        {
          name: "silver_elite",
          bonus: 1,
        },
        {
          name: "silver_elite_master",
          bonus: 1,
        },
        {
          name: "glob_nova_1",
          bonus: 1.5,
        },
        {
          name: "glob_nova_2",
          bonus: 1.5,
        },
        {
          name: "glob_nova_3",
          bonus: 1.5,
        },
        {
          name: "glob_nova_master",
          bonus: 1.5,
        },
        {
          name: "master_guardian_1",
          bonus: 2,
        },
        {
          name: "master_guardian_2",
          bonus: 2,
        },
        {
          name: "master_guardian_elite",
          bonus: 2,
        },
        {
          name: "distinguished_master_guardian",
          bonus: 4,
        },
        {
          name: "legendary_eagle",
          bonus: 4,
        },
        {
          name: "legendary_eagle_master",
          bonus: 4,
        },
        {
          name: "supreme",
          bonus: 4,
        },
        {
          name: "global_elite",
          bonus: 8,
        },
      ],
    },
    {
      name: "CN",
      costs: [
        {
          name: "silver_1",
          bonus: 1,
        },
        {
          name: "silver_2",
          bonus: 1,
        },
        {
          name: "silver_3",
          bonus: 1,
        },
        {
          name: "silver_4",
          bonus: 1,
        },
        {
          name: "silver_elite",
          bonus: 1,
        },
        {
          name: "silver_elite_master",
          bonus: 1,
        },
        {
          name: "glob_nova_1",
          bonus: 1.5,
        },
        {
          name: "glob_nova_2",
          bonus: 1.5,
        },
        {
          name: "glob_nova_3",
          bonus: 1.5,
        },
        {
          name: "glob_nova_master",
          bonus: 1.5,
        },
        {
          name: "master_guardian_1",
          bonus: 2,
        },
        {
          name: "master_guardian_2",
          bonus: 2,
        },
        {
          name: "master_guardian_elite",
          bonus: 2,
        },
        {
          name: "distinguished_master_guardian",
          bonus: 4,
        },
        {
          name: "legendary_eagle",
          bonus: 4,
        },
        {
          name: "legendary_eagle_master",
          bonus: 4,
        },
        {
          name: "supreme",
          bonus: 4,
        },
        {
          name: "global_elite",
          bonus: 8,
        },
      ],
    },
  ];

  // Lấy thông tin về server cụ thể
  const selectedServer = servers.find((s) => s.name === server);

  if (selectedServer) {
    // Lấy index của currentRank và desiredRank trong mảng ranks
    const currentIndex = selectedServer.costs.findIndex(
      (rank) => rank.name === currentRank,
    );
    const desiredIndex = selectedServer.costs.findIndex(
      (rank) => rank.name === desiredRank,
    );

    if (currentIndex !== -1 && desiredIndex !== -1) {
      // Tính toán giá trị dựa trên bonus
      const currentBonus = selectedServer.costs
        .slice(0, currentIndex + 1)
        .reduce((sum, rank) => sum + rank.bonus, 0);
      const desiredBonus = selectedServer.costs
        .slice(0, desiredIndex + 1)
        .reduce((sum, rank) => sum + rank.bonus, 0);

      // Kiểm tra giá trị của currentBonus và desiredBonus
      if (desiredBonus > 0 && currentBonus > 0) {
        // Tính toán tổng chi phí dựa trên công thức đã cung cấp
        const totalCost = (desiredBonus - currentBonus) * 10000;
        return totalCost;
      }
    }
  }
  return -1; // Trả về -1 nếu không tìm thấy server
};
