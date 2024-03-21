import { FaArrowAltCircleDown, FaSearch, FaStar } from "react-icons/fa";
import { useForm } from "react-hook-form";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useEffect, useState } from "react";
import { saveAs } from "filesaver.js-npm";

function App() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [datafilter, setDatafilter] = useState([]);
  const [sort, setSort] = useState("");
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/ListBook.json")
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => {
        // Gán dữ liệu từ response vào biến data
        setData(jsonData);
        setDatafilter(jsonData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const handleSubmitForm = (e) => {
    const newBook = {};
    if (
      name != null &&
      name.trim() != "" &&
      author != null &&
      author.trim() != ""
    ) {
      newBook["name"] = name;
      newBook["author"] = author;
      newBook["favorite"] = favorite.toString();
    }
    const jsonBlob = new Blob([JSON.stringify([...data, newBook])], {
      type: "application/json",
    });

    saveAs(jsonBlob, "ListBook.json");
    setData([...data, newBook]);
  };
  const handleSearchData = () => {
    if (keyword != null && keyword.trim != "") {
      const filteredData = data.filter((item) => {
        // Nếu data là null hoặc không có trường name và author, trả về false
        if (!item || !item.name || !item.author) {
          return false;
        }

        // Tạo biến regex từ từ khóa tìm kiếm (searchTerm)
        const regex = new RegExp(keyword, "gi");

        // Sử dụng regex để kiểm tra xem name hoặc author có chứa searchTerm không
        return item.name.match(regex) || item.author.match(regex);
      });
      setDatafilter(filteredData);
    } else {
      setDatafilter(data);
    }
  };
  const handleSortData = (e) => {
    setSort(e.target.value);
    const sortBy = e.target.value;

    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const fieldA =
        sortBy === "name" ? a.name.toUpperCase() : a.author.toUpperCase();
      const fieldB =
        sortBy === "name" ? b.name.toUpperCase() : b.author.toUpperCase();

      if (fieldA < fieldB) {
        return -1;
      }
      if (fieldA > fieldB) {
        return 1;
      }
      return 0;
    });
    setDatafilter(sortedData);
  };
  return (
    <div className="App mt-5">
      <div className="container d-flex flex-column ">
        <div className="input-group flex-nowrap">
          <span
            onClick={handleSearchData}
            className="input-group-text"
            id="addon-wrapping"
          >
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="keyword..."
            aria-label="keyword"
            aria-describedby="addon-wrapping"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <h4 className="mt-4">A list of Book</h4>
        <ul className="list-group">
          {datafilter &&
            datafilter.map((item) => (
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <div className="start d-flex gap-3 align-items-center">
                  {item?.favotite == "true" && <FaStar className="d-block" />}{" "}
                  <span>{item.name}</span>
                </div>
                <div className="end rounded-pill text-white">{item.author}</div>
              </li>
            ))}
        </ul>
        <select className="form-select mt-3" value={sort} onChange={handleSortData}>
          <option value="" key="">
            Accessing
          </option>
          <option value="name" key="">
            Name
          </option>
          <option value="author" key="">
            Author
          </option>
        </select>
        <h4 className="mt-4">Add new book</h4>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="title..."
            required
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">
            Author
          </label>
          <input
            type="text"
            className="form-control"
            id="author"
            placeholder="author..."
            name="author"
            required
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="favorite" className="form-label">
            Favorite
          </label>
          <input
            type="checkbox"
            className="ms-2"
            id="favorite"
            placeholder="author..."
            name="favorite"
            onChange={(e) => setFavorite(e.target.checked)}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button
            onClick={handleSubmitForm}
            className="btn btn-submit d-flex gap-1 align-items-center"
          >
            <FaArrowAltCircleDown className="d-block" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
