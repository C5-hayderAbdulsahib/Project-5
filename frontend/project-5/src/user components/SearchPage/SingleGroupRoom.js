const SingleRoom = (props) => {
  const { room } = props; //we used destructuring to make it easier to use them

  //   return <h1>{room.username}</h1>;

  return <h1>{room.name}</h1>;
};

export default SingleRoom;
