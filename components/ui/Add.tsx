import React, { useState } from "react";
import SubMenu from "./Submenu";
import Icon from "./Icon";
import useSchemaStore, { Object } from "@/store/schemaStore";

const Add = () => {
  const addObject = useSchemaStore((state) => state.addObject);

  const [translation, setTranslation] = useState<{
    x: number;
    y: number;
    z: number;
  }>({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState<{ x: number; y: number; z: number }>({
    x: 1,
    y: 1,
    z: 1,
  });
  const [name, setName] = useState<string>("cube");
  const [mass, setMass] = useState<number>(110);
  const [color, setColor] = useState<string>("steelblue");
  const [linearDamping, setLinearDamping] = useState<number>(1);
  const [angularDamping, setAngularDamping] = useState<number>(1);
  const [gravityScale, setGravityScale] = useState<number>(1);
  const [friction, setFriction] = useState<number>(1);
  const [restitution, setRestitution] = useState<number>(1);
  const [geometry, setGeometry] = useState<string>("cube");
  const [type, setType] = useState('dynamic');

  const item: Object = {
    name,
    geometry,
    color,
    mass,
    translation,
    rotation,
    scale,
    linearDamping,
    angularDamping,
    gravityScale,
    friction,
    restitution,
    type,
  };
  const schemaLength = useSchemaStore(state => state.objects.length)

  return (
    <SubMenu title="cube_add">
      Select shape
      <Choice
        choices={[
          {
            key: <Icon icon="circle" subMenuIcon />,
            value: "sphere",
            title: "sphere",
          },
          {
            key: <Icon icon="cube" subMenuIcon />,
            value: "cube",
            title: "cube",
          },
        ]}
        set={(choice) => setGeometry(choice)}
      />
      {/* <Slider min={0} max={10} step={1} /> */}
      <div className="flex gap-2 justify-center items-center">
        Name{" "}
        <input
          type="text"
          onChange={(value) => setName(value.target.value)}
          placeholder={name}
          className="flex-shrink py-1 px-4 w-full leading-tight bg-gray-200 rounded-md appearance-none focus:bg-white focus:border-gray-300 focus:outline-none"
        />
      </div>

        <div className="flex flex-col">
        RigidBody Type
          <select className="py-1 px-4 bg-gray-300 rounded border-none" onChange={(value) => setType(value.target.value)}>
          <option>dynamic</option>
          <option>fixed</option>
          </select>
          </div>
      <div className="flex flex-col gap-2">
        <strong>Translation</strong>
        <Input value="X" inline onChange={(value) => setTranslation({ ...translation, x: Number(value) })} />
        <Input value="Y" inline onChange={(value) => setTranslation({ ...translation, y: Number(value) })} />
        <Input value="Z" inline onChange={(value) => setTranslation({ ...translation, z: Number(value) })} />
      </div>
      <div className="flex flex-col gap-2">
        <strong>Rotation</strong>
        <Input inline value="X" onChange={(value) => setRotation({ ...rotation, x: Number(value) })} />
        <Input inline value="Y" onChange={(value) => setRotation({ ...rotation, y: Number(value) })} />
        <Input inline value="Z" onChange={(value) => setRotation({ ...rotation, z: Number(value) })} />
      </div>
      <div className="flex flex-col gap-2">
        <strong>Scale</strong>
        <Input value="X" inline onChange={(value) => setScale({ ...scale, x: Number(value) })} />
        <Input value="Y" inline onChange={(value) => setScale({ ...scale, y: Number(value) })} />
        <Input value="Z" inline onChange={(value) => setScale({ ...scale, z: Number(value) })} />
      </div>
      <div className="flex flex-col gap-2">
        <Input value="Mass" onChange={(value) => setMass(Number(value))} />
      </div>
      <div className="flex flex-col gap-2">
        <Input value="Linear Damping" onChange={(value) => setLinearDamping(Number(value))} />
      </div>
      <div className="flex flex-col gap-2">
        <Input value="Angular Damping" onChange={(value) => setAngularDamping(Number(value))} />
      </div>
      <div className="flex flex-col gap-2">
        <Input value="Gravity Scale" onChange={(value) => setGravityScale(Number(value))} />
      </div>
      <div className="flex flex-col gap-2">
        <Input value="Friction" onChange={(value) => setFriction(Number(value))} />
      </div>
      <div className="flex flex-col gap-2">
        <Input value="Restitution" onChange={(value) => setRestitution(Number(value))} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between items-center text-sm">
          Color
          <input
            type="color"
            className="flex-grow h-6 rounded border-none appearance-none outline-none focus:outline-none"
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      </div>
      <button onClick={() => addObject({...item, name: `${item.name}_${schemaLength}`})} className="py-2 px-4 text-white bg-black rounded">
        Add
      </button>
    </SubMenu>
  );
};

const Input = ({ value, onChange, inline = false }: { value: string; onChange: (value: string | number) => void; inline?: boolean }) => {
  return (
    <div className={`flex ${inline ? "flex-row items-center gap-2" : "flex-col items-start gap-0"}  justify-center `}>
      <div className="flex-grow text-sm">{value}</div>
      <input
        type="number"
        placeholder={"0.0"}
        className="flex-shrink py-1 px-4 w-full leading-tight bg-gray-200 rounded-md appearance-none focus:bg-white focus:border-gray-300 focus:outline-none"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

const Choice = ({ choices, set }: { choices: { key: any; value: string; title?: string }[]; set: (choice: string) => void }) => {
  const [active, setActive] = useState<string>(null);
  return (
    <div className="flex gap-2">
      {choices.map((choice, index) => (
        <button
          key={index}
          title={choice.title}
          className={`${active === choice.value ? "bg-gray-500" : "bg-transparent"} rounded-full flex items-center justify-center p-1`}
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

export default Add;
