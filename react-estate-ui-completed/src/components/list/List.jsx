import "./list.scss";
import Card from "../card/Card";
import { listData } from "../../lib/dummydata";

function List({ posts }) {
  // console.log("List prop", posts);
  return (
    <div className="list">
      {posts.map((item) => (
        <Card key={item._id} item={item} />
      ))}
    </div>
  );
}

export default List;
