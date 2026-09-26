import type { MoodRepository } from "modules/mood/repository/mood-repository.js";
import type { CreateLibraryDTO } from "../dto/created-library.dto.js";
import type { ILibrary } from "../repository/library.repository.js";




export class createLibraryService {
  constructor(private readonly repoLibrary: ILibrary , repoMoods : MoodRepository ) { }
  

  async execute(data : CreateLibraryDTO) {

    // const moods = 


  }
}