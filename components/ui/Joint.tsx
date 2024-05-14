"use client";
import React, { useState } from "react";
import SubMenu from "./Submenu";
import useSchemaStore, { Joint, useJointStore } from "@/store/schemaStore";
import Image from "next/image";

const Joint = () => {
  const schema = useSchemaStore((state) => state.objects);
  const addJoint = useJointStore(state => state.addJoint);

  const [positionA, setPositionA] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [orientationA, setOrientationA] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [positionB, setPositionB] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [orientationB, setOrientationB] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });

  const [ropeLength, setRopeLength] = useState(1);

  const [springRestLength, setSpringRestLength] = useState(1);
  const [stiffness, setStiffness] = useState(1000);
  const [damping, setDamping] = useState(1);
  const [bodyA, setBodyA] = useState<string>(null);
  const [bodyB, setBodyB] = useState<string>(null);

  const [jointType, setJointType] = useState<string>("fixed");
  const joint :Joint= {
    bodyA,
    bodyB,
    positionA, positionB, orientationA, orientationB,
    jointType,
    ropeLength,
    stiffness,
    damping,
  }

  return (
    <SubMenu title="graph">
      <div className="flex flex-col gap-2 p-2">
        {schema.map((object, index) => (
          <div className="flex gap-2 justify-start items-center px-4 w-full bg-gray-200 rounded">
            <Image src={"/icons/cube_dark.svg"} alt="cube" width={15} height={10} />
            {object.name}
          </div>
        ))}
        <div className="flex flex-col">
          Add Joint
          <select className="py-1 px-4 bg-gray-300 rounded border-none" onChange={(value) => setJointType(value.target.value)}>
            <option title="two bodies are fixed together">Fixed </option>
            <option title="limits the max distance between two bodies">Rope</option>
            <option title="applies a force proportional to the distance between two bodies">Spring</option>
            <option disabled title="two bodies are connected by a ball and socket, for things like arms or chains">
              Spherical
            </option>
            <option disabled title="(two bodies are connected by a hinge, for things like doors or wheels)">
              Revolute
            </option>
            <option disabled title="two bodies are connected by a sliding joint, for things like pistons or sliders">
              Prismatic
            </option>
          </select>
        </div>

        <div className="flex flex-col">
          BodyA
          <select className="py-1 px-4 bg-gray-300 rounded border-none" onChange={(value) => setBodyA(value.target.value)}>
            {schema.map((object, index) => (
              <option disabled={object.name === bodyB}>{object.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          BodyB
          <select className="py-1 px-4 bg-gray-300 rounded border-none" onChange={(value) => setBodyB(value.target.value)}>
            {schema.map((object, index) => (
              <option disabled={object.name === bodyA}>{object.name}</option>
            ))}
          </select>
        </div>

      {jointType.toLowerCase() === "fixed" && (
        <div className="flex flex-col gap-2">
          <strong>Local Position A</strong>
          <Input value="X" inline onChange={(value) => setPositionA({ ...positionA, x: Number(value) })} />
          <Input value="Y" inline onChange={(value) => setPositionA({ ...positionA, y: Number(value) })} />
          <Input value="Z" inline onChange={(value) => setPositionA({ ...positionA, z: Number(value) })} />

          <strong>Local Position B</strong>
          <Input value="X" inline onChange={(value) => setPositionB({ ...positionB, x: Number(value) })} />
          <Input value="Y" inline onChange={(value) => setPositionB({ ...positionB, y: Number(value) })} />
          <Input value="Z" inline onChange={(value) => setPositionB({ ...positionB, z: Number(value) })} />

          <strong>Local Orientation A</strong>
          <Input value="X" inline onChange={(value) => setOrientationA({ ...orientationA, x: Number(value) })} />
          <Input value="Y" inline onChange={(value) => setOrientationA({ ...orientationA, y: Number(value) })} />
          <Input value="Z" inline onChange={(value) => setOrientationA({ ...orientationA, z: Number(value) })} />

          <strong>Local Orientation B</strong>
          <Input value="X" inline onChange={(value) => setOrientationB({ ...orientationB, x: Number(value) })} />
          <Input value="Y" inline onChange={(value) => setOrientationB({ ...orientationB, y: Number(value) })} />
          <Input value="Z" inline onChange={(value) => setOrientationB({ ...orientationB, z: Number(value) })} />
        </div>
      )}
      {jointType.toLowerCase() === "rope" && (
        <div className="flex flex-col gap-2">
          <strong>Local Position A</strong>
          <Input value="X" inline onChange={(value) => setPositionA({ ...positionA, x: Number(value) })} />
          <Input value="Y" inline onChange={(value) => setPositionA({ ...positionA, y: Number(value) })} />
          <Input value="Z" inline onChange={(value) => setPositionA({ ...positionA, z: Number(value) })} />

          <strong>Local Position B</strong>
          <Input value="X" inline onChange={(value) => setPositionB({ ...positionB, x: Number(value) })} />
          <Input value="Y" inline onChange={(value) => setPositionB({ ...positionB, y: Number(value) })} />
          <Input value="Z" inline onChange={(value) => setPositionB({ ...positionB, z: Number(value) })} />

          <strong>rope Length</strong>

          <Input value="" placeholder={ropeLength} inline onChange={(value) => setRopeLength(Number(value))} />
        </div>
      )}
      {jointType.toLowerCase() === "spring" && (
        <div className="flex flex-col gap-2">
          <strong>Local Position A</strong>
          <Input value="X" inline onChange={(value) => setPositionA({ ...positionA, x: Number(value) })} />
          <Input value="Y" inline onChange={(value) => setPositionA({ ...positionA, y: Number(value) })} />
          <Input value="Z" inline onChange={(value) => setPositionA({ ...positionA, z: Number(value) })} />

          <strong>Local Position B</strong>
          <Input value="X" inline onChange={(value) => setPositionB({ ...positionB, x: Number(value) })} />
          <Input value="Y" inline onChange={(value) => setPositionB({ ...positionB, y: Number(value) })} />
          <Input value="Z" inline onChange={(value) => setPositionB({ ...positionB, z: Number(value) })} />

          <strong>spring rest length</strong>
          <Input value="" placeholder={springRestLength} inline onChange={(value) => setSpringRestLength(Number(value))} />

          <strong>stiffness</strong>
          <Input value="" placeholder={stiffness} inline onChange={(value) => setStiffness(Number(value))} />

          <strong>damping</strong>
          <Input value="" inline placeholder={damping} onChange={(value) => setDamping(Number(value))} />
        </div>
      )}

      <button onClick={() => addJoint(joint)} className="py-2 px-4 text-white bg-black rounded">
        Add
      </button>
      </div>
    </SubMenu>
  );
};
const Input = ({
  value,
  onChange,
  placeholder = "0.0",
  inline = false,
}: {
  value: string;
  placeholder?: number | string;
  onChange: (value: string | number) => void;
  inline?: boolean;
}) => {
  return (
    <div className={`flex ${inline ? "flex-row items-center gap-2" : "flex-col items-start gap-0"}  justify-center `}>
      <div className="flex-grow text-sm">{value}</div>
      <input
        placeholder={String(placeholder)}
        type="number"
        className="flex-shrink py-1 px-4 w-full leading-tight bg-gray-200 rounded-md appearance-none focus:bg-white focus:border-gray-300 focus:outline-none"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Joint;
