import { gql, useQuery } from "@apollo/client";

const Menus = () => {
  const MENUS = gql`
    query MyQuery {
      menus {
        id
        name
        description
        thumbnail {
          url
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(MENUS);
  if (loading) return "ロード中・・・";
  if (error) return `エラー！ ${error.message}`;
  console.log(data);

  return (
    <>
      <div className='container'>
        {data.menus.map((menu) => (
          <div key={menu.id}>
            <div className='card'>
              <img src={menu.thumbnail.url}></img>
              <p>{menu.name}</p>
              <p>{menu.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Menus;
