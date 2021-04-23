import { Nation, Nation2030 } from "../lib/constants.js";

export default (players, baseGame) => {
  if (baseGame === "imperial") {
    switch (players.length) {
      case 2:
        return [
          { id: players[0].id, nation: Nation.AH },
          { id: players[1].id, nation: Nation.IT }
        ];
      case 3:
        return [
          { id: players[0].id, nation: Nation.AH },
          { id: players[1].id, nation: Nation.IT },
          { id: players[2].id, nation: Nation.FR }
        ];
      case 4:
        return [
          { id: players[0].id, nation: Nation.AH },
          { id: players[1].id, nation: Nation.IT },
          { id: players[2].id, nation: Nation.FR },
          { id: players[3].id, nation: Nation.GB }
        ];
      case 5:
        return [
          { id: players[0].id, nation: Nation.AH },
          { id: players[1].id, nation: Nation.IT },
          { id: players[2].id, nation: Nation.FR },
          { id: players[3].id, nation: Nation.GB },
          { id: players[4].id, nation: Nation.GE }
        ];
      case 6:
        return [
          { id: players[0].id, nation: Nation.AH },
          { id: players[1].id, nation: Nation.IT },
          { id: players[2].id, nation: Nation.FR },
          { id: players[3].id, nation: Nation.GB },
          { id: players[4].id, nation: Nation.GE },
          { id: players[5].id, nation: Nation.RU }
        ];
    }
  } else if (baseGame === "imperial2030") {
    switch (players.length) {
      case 2:
        return [
          { id: players[0].id, nation: Nation2030.RU },
          { id: players[1].id, nation: Nation2030.CN }
        ];
      case 3:
        return [
          { id: players[0].id, nation: Nation2030.RU },
          { id: players[1].id, nation: Nation2030.CN },
          { id: players[2].id, nation: Nation2030.IN }
        ];
      case 4:
        return [
          { id: players[0].id, nation: Nation2030.RU },
          { id: players[1].id, nation: Nation2030.CN },
          { id: players[2].id, nation: Nation2030.IN },
          { id: players[3].id, nation: Nation2030.BR }
        ];
      case 5:
        return [
          { id: players[0].id, nation: Nation2030.RU },
          { id: players[1].id, nation: Nation2030.CN },
          { id: players[2].id, nation: Nation2030.IN },
          { id: players[3].id, nation: Nation2030.BR },
          { id: players[4].id, nation: Nation2030.US }
        ];
      case 6:
        return [
          { id: players[0].id, nation: Nation2030.RU },
          { id: players[1].id, nation: Nation2030.CN },
          { id: players[2].id, nation: Nation2030.IN },
          { id: players[3].id, nation: Nation2030.BR },
          { id: players[4].id, nation: Nation2030.US },
          { id: players[5].id, nation: Nation2030.EU }
        ];
    }
  }
}
