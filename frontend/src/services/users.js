import axios from "axios";
const baseUrl = `${process.env.REACT_APP_API_URL}/api/users`;

const getAll = async() => {
  const request = await axios.get(baseUrl);
  console.log(request.data)
  return request.data;
};

export default { getAll };
