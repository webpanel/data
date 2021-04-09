import {
  ResourceCollection,
  ResourceCollectionConfig,
} from "../ResourceCollection";
import { useEffect, useState } from "react";

import { ResourceID } from "../Resource";

export interface ResourceCollectionHookConfig<T>
  extends ResourceCollectionConfig<T> {
  disabled?: boolean;
}

export function useResourceCollection<T extends { id: ResourceID } = any>(
  config: ResourceCollectionHookConfig<T>
): ResourceCollection<T> {
  const [resourceCollection, setCollection] = useState<ResourceCollection<T>>(
    new ResourceCollection(config)
  );

  // @ts-ignore
  const [_, setVersion] = useState(0);
  // @ts-ignore
  const [_, setDataVersion] = useState(0);
  const [conf, setConf] = useState("");

  const stringConf = JSON.stringify([
    config.autopersistConfigKey,
    config.aggregations,
    config.initialFilters,
    config.initialSearch,
    config.initialSorting,
    config.initialOffset,
    config.initialLimit,
    config.pollInterval,
    config.disabled,
  ]);
  resourceCollection.onPollHandler = () => {
    setCollection(resourceCollection);
    setVersion(new Date().getTime());
  };
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const newCollection = new ResourceCollection<T>({
        ...config,
        onDidChange: () => {
          setDataVersion(new Date().getTime());
        },
      });

      newCollection.onPollHandler = () => {
        setCollection(newCollection);
        setVersion(new Date().getTime());
      };
      newCollection.get();
      if (mounted) {
        setCollection(newCollection as ResourceCollection<T>);
        setVersion(new Date().getTime());
      }
    };
    if (mounted && conf !== stringConf && !config.disabled) {
      load();
      setConf(stringConf);
    }
    return () => {
      mounted = false;
    };
  }, [stringConf]);

  useEffect(() => {
    resourceCollection.startPolling();
    return () => {
      resourceCollection.stopPolling();
    };
  }, [config.pollInterval]);

  return resourceCollection;
}
