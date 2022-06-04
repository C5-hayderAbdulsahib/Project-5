const SingleCategory = (props) => {
  const { name, id, setUpdateName, updateCategoryFun, deleteCategoryFun } =
    props; //we used destructuring to make it easier to use them

  return (
    <>
      <p>{name}</p>
      <input
        type={"text"}
        onChange={(e) => {
          setUpdateName(e.target.value);
        }}
      />
      <button
        onClick={() => {
          updateCategoryFun(id);
        }}
      >
        update
      </button>
      <button
        onClick={() => {
          deleteCategoryFun(id);
        }}
      >
        delete
      </button>
      <hr></hr>
    </>
  );
};

export default SingleCategory;
