import inquirer from "inquirer";
import MenuOptions from "./enums/MenuOptions";
import Movie from "./interfaces/Movie";
import User from "./interfaces/User";
import MovieService from "./services/MovieService";
import addFilms from "./utils/addFilms";
import calculateMoviesAverage from "./utils/calculateMoviesAverage";

const users: User[] = [
  {
    id: 1,
    name: "Tiago",
    age: 300,
    myList: [],
  },
];

const questions = [
  {
    type: "input",
    name: "option",
    message:
      "\nDigite uma opção:  \n 1 - Mostrar com média \n 2 - Dar avaliação \n 3 - Adicionar filme a lista \n 0 - Sair\n",
  },
];

const chooseMovieQuestions = [
  {
    type: "number",
    name: "option",
    message: "Qual filme?",
  },
];

const rateQuestions = [
  {
    type: "number",
    name: "option",
    message: "Qual avaliacao de 0 a 5?",
  },
];

let movies: Movie[];
let loggedUserId;

async function run() {
  const movieService = new MovieService();

  try {
    console.log("Carregando filmes...");
    movies = await movieService.listAll();
    console.log("Download Concluído...");
    movies.map((movie) => console.log(`${movie.id} - ${movie.name}`));
  } catch (e) {
    console.error("Problema ao baixar filmes");
  }

  const loginUser = [
    {
      type: "number",
      name: "option",
      message: "Selecione um usuário para continuar: ",
    },
  ];
  users.map((user) => console.log(`${user.id} - ${user.name}`));
  const userAnswer = await inquirer.prompt(loginUser);
  loggedUserId = users.findIndex((user) => user.id === userAnswer.option);

  const answers = await inquirer.prompt(questions);

  switch (answers.option) {
    case MenuOptions.RATE_MOVIE:
      let movieId: number;
      let rate: number;

      const chooseMovieAnswers = await inquirer.prompt(chooseMovieQuestions);
      movieId = chooseMovieAnswers.option;

      const rateAnswers = await inquirer.prompt(rateQuestions);
      rate = rateAnswers.option;

      movies.forEach((movie) => {
        if (movie.id === movieId) {
          movie.ratings.push(rate);
        }
      });

      run();
      break;

    case MenuOptions.SHOW_WITH_AVERAGE:
      const moviesWithAverage = calculateMoviesAverage(movies);
      moviesWithAverage.map((movie) =>
        console.log(`${movie.name}, Média: ${movie.average}`)
      );
      run();
      break;

    case MenuOptions.ADD_TO_LIST:
      const addToListQuestion = [
        {
          type: "input",
          name: "option",
          message: "Digite o(s) id(s) do(s) filme(s): (ex: 1, 2, 3)",
        },
      ];
      const answers = await inquirer.prompt(addToListQuestion);
      const ids: number[] = answers.option
        .split(",")
        .map((id: string) => parseInt(id));
      console.log(ids);
      users[loggedUserId] = addFilms(users[loggedUserId], movies, ...ids);
      console.log(users[loggedUserId]);
      break;

    case MenuOptions.EXIT:
      break;
  }
}

run();
