export const useChild = (prop: { id: number }) => {
  const getChildId = () => {
    return prop.id;
  };
  return {
    getChildId
  };
};
