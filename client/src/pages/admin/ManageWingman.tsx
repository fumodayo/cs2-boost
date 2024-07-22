import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/Input";
import UserPage from "../../components/Layouts/UserPage";
import { useState, ChangeEvent, useEffect } from "react";
import { Button } from "../../components/Buttons/Button";
import { axiosAuth } from "../../axiosAuth";
import { useGetWingmanPrice } from "../../hooks/useManagePrice";
import Loading from "../Loading";

interface Cost {
  name: string;
  bonus: number;
  code: string;
  image: string;
}

interface Server {
  name: string;
  value: string;
  costs: Cost[];
}

const ManageWingman = () => {
  const { price_list, unit_price } = useGetWingmanPrice() || {};

  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>("Asia");
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({});

  useEffect(() => {
    if (price_list && unit_price) {
      setServers(price_list);
      setLoading(false);
      reset({ costPerPoint: unit_price });
    }
  }, [price_list, unit_price, reset]);

  const handleServerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedServer(e.target.value);
  };

  const handleBonusChange = (
    serverName: string,
    costIndex: number,
    newBonus: string,
  ) => {
    const updatedServers = servers.map((server) => {
      if (server.name === serverName) {
        const updatedCosts = [...server.costs];
        updatedCosts[costIndex].bonus = parseFloat(newBonus);
        setIsSaveEnabled(true);
        return { ...server, costs: updatedCosts };
      }
      return server;
    });
    setServers(updatedServers);
  };

  const selectedServerData = servers.find(
    (server) => server.name === selectedServer,
  );

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    const { data } = await axiosAuth.post(`/manage/wingman`, {
      unit_price: form.costPerPoint,
      price_list: servers,
    });
    if (data.success === true) {
      const { price_list, unit_price } = data;
      setServers(price_list);
      reset({ costPerPoint: unit_price });
      setIsSaveEnabled(false);
    }
  };

  const headers = ["rank", "name", "bonus"];

  if (loading) {
    return <Loading />;
  }

  return (
    <UserPage>
      <div className="container flex flex-col gap-5">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
          Manage Wingman Cost
        </h1>
        <div className="flex max-w-[1000px] items-end justify-between gap-2">
          <div className="flex gap-2">
            <Input
              type="number"
              register={register}
              errors={errors}
              className="max-w-[160px]"
              id="costPerPoint"
              label="Cost per point"
              rules={{
                max: 10000,
                min: 0,
              }}
              onChange={() => setIsSaveEnabled(true)}
              required
            />
            <div>
              <div className="mb-1">
                <label className="block text-sm font-bold leading-6 text-foreground/90">
                  Select Server
                </label>
              </div>
              <select
                className="h-8 w-[200px] justify-between rounded-md border-0 bg-field px-2 text-sm text-field-foreground shadow-sm outline-none ring-1 ring-field-ring"
                value={selectedServer}
                onChange={handleServerChange}
              >
                {servers.map((server) => (
                  <option key={server.name} value={server.name}>
                    {server.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={!isSaveEnabled}
              className="h-9 w-[120px] gap-1 rounded-md px-4 py-2 text-sm font-medium"
            >
              Save Changes
            </Button>
            <Button
              type="submit"
              color="light"
              onClick={() => {
                setIsSaveEnabled(false);
              }}
              disabled={!isSaveEnabled}
              className="h-9 w-[120px] gap-1 rounded-md px-4 py-2 text-sm font-medium"
            >
              Reset
            </Button>
          </div>
        </div>
        {selectedServerData && (
          <div className="-mx-4 max-w-[1000px] border border-border/50 sm:-mx-6 lg:-mx-0 lg:rounded-md">
            <table className="w-full caption-bottom text-sm">
              <thead className="overflow-clip [&_tr]:border-b">
                <tr className="border-b border-border text-muted-foreground transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  {headers.map((header) => (
                    <th
                      className={`h-10 bg-card-surface px-2.5 text-left align-middle font-bold capitalize text-muted-foreground first:rounded-tl-md first:pl-4 last:rounded-tr-md [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedServerData.costs.map((cost, index) => (
                  <tr
                    className="border-b border-border px-2.5 text-muted-foreground transition-colors hover:bg-muted/50"
                    key={cost.name}
                  >
                    <td className="cursor-pointer px-2.5 py-2.5 text-left align-middle font-bold first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                      <img
                        src={`/assets/counter-strike-2/wingman/${cost.image}.png`}
                        alt={cost.code}
                        className="w-16"
                      />
                    </td>
                    <td className="cursor-pointer px-2.5 py-2.5 text-left align-middle font-bold first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                      {cost.name}
                    </td>
                    <td className="cursor-pointer px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                      <Input
                        id={String(index)}
                        register={register}
                        errors={errors}
                        type="number"
                        value={cost.bonus}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleBonusChange(
                            selectedServerData.name,
                            index,
                            e.target.value,
                          )
                        }
                        rules={{
                          max: 10000,
                          min: 0,
                        }}
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </UserPage>
  );
};

export default ManageWingman;
