const SingleSearchResult = (props) => {
  const { search } = props; //we used destructuring to make it easier to use them

  console.log(search);

  return (
    <>
      {search?.username ? <h1>{search.username}</h1> : ""}
      {search?.name ? <h1>{search.name}</h1> : ""}
    </>
  );
};

export default SingleSearchResult;
