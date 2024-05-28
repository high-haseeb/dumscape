import React, { useState } from "react";
import SubMenu from "./Submenu";
import Image from "next/image";
import useSchemaStore, { Impulse, Object, useImpulseStore } from "@/store/schemaStore";

const Impulse = () => {
  const schema = useSchemaStore((state) => state.objects);
  const addImpulse = useImpulseStore(state => state.addImpulse);

  const [sObject, setSObject] = useState<Object>(null);
  const [impulseType, setImpulseType] = useState<string>(null);
  const [mag, setMag] = useState(1);
  const [direction, setdirection] = useState<{
    x: number;
    y: number;
    z: number;
  }>({ x: 0, y: 0, z: 0 });
  const impulseLength = useImpulseStore(state => state.impulses.length)
  const impulse : Impulse = {
    index: impulseLength,
    type: impulseType,
    direction,
    magnitude: mag,
    bodyRef: schema.find(body => {return body === sObject})? schema.find(body => {return body === sObject}).ref : null
  }

  return (
    <SubMenu title="arrow_down">
      <div className="flex flex-col gap-2 p-2">
        {schema.map((object, _index) => (
          <div
            className={`flex gap-2 justify-start items-center px-4 w-full ${sObject === object ? "bg-orange-300" : "bg-gray-200"} rounded`}
            onClick={() => setSObject(object)}
          >
            <Image src={"/icons/cube_dark.svg"} alt="cube" width={15} height={10} />
            {object.name}
          </div>
        ))}
        <Choice
          choices={[
            { key: "linear impulse", value: "linear", title: "apply linear impulse" },
            { key: "torque impulse", value: "angular", title: "apply torque impulse" },
          ]}
          set={(choice) => setImpulseType(choice)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <strong>Direction (normalized)</strong>
        <Input value="X" inline onChange={(value) => setdirection({ ...direction, x: Number(value) })} />
        <Input value="Y" inline onChange={(value) => setdirection({ ...direction, y: Number(value) })} />
        <Input value="Z" inline onChange={(value) => setdirection({ ...direction, z: Number(value) })} />
      </div>

      <div className="flex flex-col gap-2">
        <strong>Magnitude</strong>
        <Input value="" inline onChange={(value) => setMag(Number(value))} />
      </div>
      <button onClick={() => addImpulse(impulse) }className="py-2 px-4 text-white bg-black rounded">
        Add
      </button>
    </SubMenu>
  );
};

const Choice = ({ choices, set }: { choices: { key: any; value: string; title?: string }[]; set: (choice: string) => void }) => {
  const [active, setActive] = useState<string>(null);
  return (
    <div className="flex gap-2 flex-col">
      {choices.map((choice, index) => (
        <button
          key={index}
          title={choice.title}
          className={`${active === choice.value ? "bg-orange-400" : "bg-transparent"} rounded-full flex items-center justify-center p-1`}
          onClick={() => {
            setActive(choice.value);
            set(choice.value);
          }}
        >
          {choice.key}
        </button>
      ))}
    </div>
  );
};

const Input = ({ value, onChange, inline = false }: { value: string; onChange: (value: string | number) => void; inline?: boolean }) => {
  return (
    <div className={`flex ${inline ? "flex-row items-center gap-2" : "flex-col items-start gap-0"}  justify-center `}>
      <div className="flex-grow text-sm">{value}</div>
      <input
        type="number"
        step={0.1}
        placeholder={"0.0"}
        className="flex-shrink py-1 px-4 w-full leading-tight bg-gray-200 rounded-md appearance-none focus:bg-white focus:border-gray-300 focus:outline-none"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Impulse;
