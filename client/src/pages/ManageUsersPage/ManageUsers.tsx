import {
  Helmet,
  Pagination,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { FaUsers } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useToggleColumns } from "~/hooks/useToggleColumns";
import { pendingBoostsHeaders } from "~/constants/headers";
import { axiosAuth } from "~/axiosAuth";
import { RootState } from "~/redux/store";
import { useSelector } from "react-redux";

// const boosts = [
//   {
//     _id: "order_001",
//     title: "Boost to Diamond",
//     boost_id: "boost_123",
//     type: "rank_boost",
//     server: "NA",
//     price: 150,
//     game: "League of Legends",
//     begin_rating: 1200,
//     end_rating: 2000,
//     begin_rank: "Gold",
//     end_rank: "Diamond",
//     begin_exp: 5000,
//     end_exp: 10000,
//     total_time: 48,
//     options: [
//       { name: "duo_queue", label: "Duo Queue", value: 50 },
//       { name: "priority", label: "Priority Order", value: 30 },
//     ],
//     retryCount: 0,
//     status: "pending",
//     user: { id: "user_001", name: "PlayerOne" },
//     partner: { id: "partner_001", name: "BoosterX" },
//     assign_partner: null,
//     account: { username: "player123", region: "NA" },
//     conversation: { participants: [], messages: [] },
//     updatedAt: new Date(),
//   },
//   {
//     _id: "order_002",
//     title: "Level Up to 60",
//     boost_id: "boost_456",
//     type: "level_farming",
//     server: "EU",
//     price: 200,
//     game: "World of Warcraft",
//     begin_rating: null,
//     end_rating: null,
//     begin_rank: null,
//     end_rank: null,
//     begin_exp: 20000,
//     end_exp: 60000,
//     total_time: 72,
//     options: [{ name: "fast_delivery", label: "Fast Delivery", value: 40 }],
//     retryCount: 1,
//     status: "in_progress",
//     user: { id: "user_002", name: "WoWMaster" },
//     partner: { id: "partner_002", name: "SpeedyBooster" },
//     assign_partner: { id: "partner_002", name: "SpeedyBooster" },
//     account: { username: "wowplayer", region: "EU" },
//     conversation: { participants: [], messages: [] },
//     updatedAt: new Date(),
//   },
//   {
//     _id: "order_003",
//     title: "Valorant Rank Boost",
//     boost_id: "boost_789",
//     type: "rank_boost",
//     server: "Asia",
//     price: 100,
//     game: "Valorant",
//     begin_rating: 800,
//     end_rating: 1500,
//     begin_rank: "Silver",
//     end_rank: "Platinum",
//     begin_exp: null,
//     end_exp: null,
//     total_time: 36,
//     options: [{ name: "coaching", label: "Coaching", value: 20 }],
//     retryCount: 0,
//     status: "completed",
//     user: { id: "user_003", name: "AceShooter" },
//     partner: { id: "partner_003", name: "SharpAim" },
//     assign_partner: { id: "partner_003", name: "SharpAim" },
//     account: { username: "valorantpro", region: "Asia" },
//     conversation: { participants: [], messages: [] },
//     updatedAt: new Date(),
//   },
//   {
//     _id: "order_004",
//     title: "CS2 Rank Boost",
//     boost_id: "boost_101",
//     type: "rank_boost",
//     server: "NA",
//     price: 180,
//     game: "CS2",
//     begin_rating: 1000,
//     end_rating: 2200,
//     begin_rank: "MG1",
//     end_rank: "Global Elite",
//     begin_exp: null,
//     end_exp: null,
//     total_time: 50,
//     options: [{ name: "no_cheat", label: "Legit Boost", value: 60 }],
//     retryCount: 2,
//     status: "pending",
//     user: { id: "user_004", name: "ClutchKing" },
//     partner: null,
//     assign_partner: null,
//     account: { username: "cspro", region: "NA" },
//     conversation: { participants: [], messages: [] },
//     updatedAt: new Date(),
//   },
//   {
//     _id: "order_005",
//     title: "Apex Legends Rank Boost",
//     boost_id: "boost_202",
//     type: "rank_boost",
//     server: "EU",
//     price: 170,
//     game: "Apex Legends",
//     begin_rating: 2000,
//     end_rating: 4000,
//     begin_rank: "Gold",
//     end_rank: "Predator",
//     begin_exp: null,
//     end_exp: null,
//     total_time: 60,
//     options: [{ name: "priority", label: "Priority Order", value: 40 }],
//     retryCount: 1,
//     status: "completed",
//     user: { id: "user_005", name: "LegendsNeverDie" },
//     partner: { id: "partner_005", name: "ApexPro" },
//     assign_partner: { id: "partner_005", name: "ApexPro" },
//     account: { username: "apexchamp", region: "EU" },
//     conversation: { participants: [], messages: [] },
//     updatedAt: new Date(),
//   },
//   {
//     _id: "order_006",
//     title: "Dota 2 MMR Boost",
//     boost_id: "boost_303",
//     type: "mmr_boost",
//     server: "SEA",
//     price: 140,
//     game: "Dota 2",
//     begin_rating: 3000,
//     end_rating: 4500,
//     begin_rank: "Ancient",
//     end_rank: "Divine",
//     begin_exp: null,
//     end_exp: null,
//     total_time: 55,
//     options: [{ name: "coaching", label: "Coaching", value: 30 }],
//     retryCount: 0,
//     status: "in_progress",
//     user: { id: "user_006", name: "InvokerGod" },
//     partner: { id: "partner_006", name: "MMRKing" },
//     assign_partner: { id: "partner_006", name: "MMRKing" },
//     account: { username: "dotaplayer", region: "SEA" },
//     conversation: { participants: [], messages: [] },
//     updatedAt: new Date(),
//   },
//   {
//     _id: "order_007",
//     title: "Fortnite Level Boost",
//     boost_id: "boost_404",
//     type: "level_farming",
//     server: "NA",
//     price: 90,
//     game: "Fortnite",
//     begin_rating: null,
//     end_rating: null,
//     begin_rank: null,
//     end_rank: null,
//     begin_exp: 1000,
//     end_exp: 5000,
//     total_time: 24,
//     options: [
//       { name: "battle_pass", label: "Battle Pass Included", value: 20 },
//     ],
//     retryCount: 0,
//     status: "pending",
//     user: { id: "user_007", name: "VictoryRoyale" },
//     partner: null,
//     assign_partner: null,
//     account: { username: "fortplayer", region: "NA" },
//     conversation: { participants: [], messages: [] },
//     updatedAt: new Date(),
//   },
//   {
//     _id: "order_008",
//     title: "Call of Duty Warzone KD Boost",
//     boost_id: "boost_505",
//     type: "kd_boost",
//     server: "EU",
//     price: 110,
//     game: "Call of Duty: Warzone",
//     begin_rating: 1.2,
//     end_rating: 2.5,
//     begin_rank: null,
//     end_rank: null,
//     begin_exp: null,
//     end_exp: null,
//     total_time: 30,
//     options: [{ name: "coaching", label: "Coaching", value: 25 }],
//     retryCount: 1,
//     status: "completed",
//     user: { id: "user_008", name: "CODPro" },
//     partner: { id: "partner_008", name: "WarzoneGod" },
//     assign_partner: { id: "partner_008", name: "WarzoneGod" },
//     account: { username: "warzonechamp", region: "EU" },
//     conversation: { participants: [], messages: [] },
//     updatedAt: new Date(),
//   },
// ];

const ManageUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { currentAdmin } = useSelector((state: RootState) => state.admin);

  const handleReset = () => {
    setSearchTerm("");
  };

  const { selectedColumns, toggleColumn } = useToggleColumns(
    "pending-boosts-headers",
    pendingBoostsHeaders,
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosAuth.post(`/admin/get-users?`, {
          user_id: currentAdmin?._id,
        });
        console.log({ data });
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <>
      <Helmet title="Manage Users · CS2Boost" />
      <div>
        <Heading
          icon={FaUsers}
          title="Manage Users"
          subtitle="List of all users."
        />
        <main>
          <div className="mt-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  {/* SEARCH */}
                  <Search
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  {searchTerm && <ResetButton onReset={handleReset} />}
                </div>
                {/* VIEW LIST */}
                <ViewButton
                  headers={pendingBoostsHeaders}
                  toggleColumn={toggleColumn}
                  selectedColumns={selectedColumns}
                />
              </div>

              {/* DATA LIST */}
              {/* <DataTable
                headers={visibleHeaders}
                toggleColumn={toggleColumn}
                boosts={boosts}
              /> */}

              {/* PAGINATION */}
              <Pagination total={20} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ManageUsersPage;
