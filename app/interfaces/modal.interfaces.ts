export type MetadataType<StepType extends string> = {
    from: StepType,
};
export type ActionsType<StepType extends string> = {
    to: (step: StepType) => void;
    close: () => void;
};

export type ModalType = {
    title: string;
    description?: string;
    component: Component;
};

export type ModalsType<StepType extends string> = {
    [K in StepType]: ModalType;
};

export type ActionsOf<
  Map extends Record<string, readonly string[]>,
  K extends keyof Map
> = Map[K][number];

export type ActionsObject<
  Map extends Record<string, readonly string[]>,
  K extends keyof Map
> = Record<ActionsOf<Map, K>, ActionFn<Map>>;

export type ActionFn<Map extends Record<string, readonly string[]>> = (
  actions: ActionsType<Extract<keyof Map, string>>,
  metadata: MetadataType<Extract<keyof Map, string>>
) => void;

export type ModalsWithActionsType<Map extends Record<string, readonly string[]>> = {
  [K in keyof Map]: ModalType & {
    actions: ActionsObject<Map, K>;
  };
};
