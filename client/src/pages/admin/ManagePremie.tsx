import { ChangeEvent, useEffect, useState } from "react";
import UserPage from "../../components/Layouts/UserPage";
import Input from "../../components/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../components/Buttons/Button";
import { useGetPremierPrice } from "../../hooks/useManagePrice";
import Loading from "../Loading";
import { axiosAuth } from "../../axiosAuth";

interface Cost {
  start: number;
  end: number;
  bonus: number;
}

interface Server {
  name: string;
  costs: Cost[];
}

const ManagePremie = () => {
  const { price_list, unit_price } = useGetPremierPrice();

  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServerIndex, setSelectedServerIndex] = useState<number | null>(
    1,
  );
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

  const handleBonusChange = (costIndex: number, newBonus: string) => {
    if (selectedServerIndex === null) return;
    const updatedServers = [...servers];
    updatedServers[selectedServerIndex].costs[costIndex].bonus =
      parseFloat(newBonus);
    setServers(updatedServers);
    setIsSaveEnabled(true);
  };

  const handleServerSelect = (index: number) => {
    setSelectedServerIndex(index);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    const { data } = await axiosAuth.post(`/manage/premier`, {
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

  const headers = ["range premier point", "bonus"];

  if (loading) {
    return <Loading />;
  }

  return (
    <UserPage>
      <div className="container flex flex-col gap-5">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
          Manage Premie Cost
        </h1>
        <div className="flex max-w-[800px] items-end justify-between gap-2">
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
                onChange={(e) => handleServerSelect(parseInt(e.target.value))}
                defaultValue="Asia"
              >
                {servers.map((server, index) => (
                  <option key={server.name} value={index}>
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
                setServers(price_list);
              }}
              disabled={!isSaveEnabled}
              className="h-9 w-[120px] gap-1 rounded-md px-4 py-2 text-sm font-medium"
            >
              Reset
            </Button>
          </div>
        </div>
        {selectedServerIndex !== null && (
          <div className="-mx-4 w-[800px] border border-border/50 sm:-mx-6 lg:-mx-0 lg:rounded-md">
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
                {servers[selectedServerIndex].costs.map((cost, costIndex) => (
                  <tr
                    className="border-b border-border px-2.5 text-muted-foreground transition-colors hover:bg-muted/50"
                    key={cost.start}
                  >
                    <td className="cursor-pointer px-2.5 py-2.5 text-left align-middle font-bold first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                      {cost.start} {`->`} {cost.end}
                    </td>
                    <td className="cursor-pointer px-2.5 py-2.5 text-left align-middle first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                      <Input
                        id={String(costIndex)}
                        register={register}
                        errors={errors}
                        type="number"
                        value={cost.bonus}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleBonusChange(costIndex, e.target.value)
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

export default ManagePremie;
