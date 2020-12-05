import axios from 'axios';

export const fetchContest = contestId =>
  axios.get(`/api/contests/${contestId}`).then(resp => resp.data);