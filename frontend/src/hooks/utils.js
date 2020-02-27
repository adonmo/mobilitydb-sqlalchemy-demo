export const makeSmartSetState = (dumbSetState, state) => {
  return (newState, ...args) => {
    dumbSetState(
      {
        ...state,
        ...newState
      },
      ...args
    );
  };
};
