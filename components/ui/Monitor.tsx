import React, {useState} from 'react'
import SubMenu from './Submenu'
import Image from 'next/image'
import useSchemaStore, { Object, useGraphStore } from '@/store/schemaStore'

const Monitor = () => {
  const schema = useSchemaStore(state => state.objects);
  const graph = useGraphStore();
  return (
    <SubMenu title='monitor'>
      <div className="flex flex-col gap-2 p-2">
        {schema.map((object, _index) => (
          <div className={`flex gap-2 justify-start items-center px-4 w-full ${graph.graphBody === object ? "bg-orange-300" : "bg-gray-200"} rounded`} 
            onClick={() => graph.setGraphBody(object)}>
            <Image src={"/icons/cube_dark.svg"} alt="cube" width={15} height={10} />
            {object.name}
          </div>
        ))}
        </div>
    </SubMenu>
  )
}

export default Monitor
