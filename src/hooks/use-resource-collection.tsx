import {
  ResourceCollection,
  ResourceCollectionConfig,
} from "../ResourceCollection";
import { useEffect, useState } from "react";

import { ResourceID } from "../Resource";

export function useResourceCollection<T extends { id: ResourceID } = any>(
  config: ResourceCollectionConfig<T>
): ResourceCollection<T> {
  const [resourceCollection, setCollection] = useState<ResourceCollection<T>>(
    new ResourceCollection(config)
  );
  const [version, setVersion] = useState(0);
  const [conf, setConf] = useState("");

  const stringConf = JSON.stringify(config);

  useEffect(() => {
    const load = async () => {
      const newCollection = new ResourceCollection(config);
      setCollection(newCollection as ResourceCollection<T>);
      await newCollection.get();
      setVersion(version + 1);
    };
    if (conf !== stringConf) {
      load();
      setConf(stringConf);
    }
  });

  useEffect(() => {
    resourceCollection.startPolling();
    return () => {
      resourceCollection.stopPolling();
    };
  }, [config.pollInterval]);

  return resourceCollection;
}
