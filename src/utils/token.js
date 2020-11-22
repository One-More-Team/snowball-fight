export const getTokenByIds = ({ idA, idAB }) =>
  idAB < idA ? `${idAB}/${idA}` : `${idA}/${idAB}`;
