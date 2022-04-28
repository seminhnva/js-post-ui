import axiosClient from './api/axiosClient';
import postApi from './api/postApi';

async function main() {
  const params = {
    _page: 1,
    _limit: 5,
  };
  const response = await postApi.getAll(params);
  console.log(response);
}
main();
