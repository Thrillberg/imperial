import Board from './Board';
import Province from './Province';

export default class EuropeBoard extends Board {
  #britishIsles;
  #frenchTerritories;
  #northAfrica;
  #iberianPeninsula;
  #beneluxCountries;
  #scandinavianCountries;
  #germanTerritories;
  #italianTerritories;
  #austrianHungarianTerritories;
  #balkanCountries;
  #russianTerritories;

  #seas;

  get BritishIsles() {
    return this.#britishIsles;
  }
  get FrenchTerritories() {
    return this.#frenchTerritories;
  }
  get IberianPeninsula() {
    return this.#iberianPeninsula;
  }
  get NorthAfrica() {
    return this.#northAfrica;
  }
  get BeneluxCountries() {
    return this.#beneluxCountries;
  }
  get ScandinavianCountries() {
    return this.#scandinavianCountries;
  }
  get GermanTerritories() {
    return this.#germanTerritories;
  }
  get ItalianTerritories() {
    return this.#italianTerritories;
  }
  get AustrianHungarianTerritories() {
    return this.#austrianHungarianTerritories;
  }
  get BalkanCountries() {
    return this.#balkanCountries;
  }
  get RussianTerritories() {
    return this.#russianTerritories;
  }
  
  get Seas() {
    return this.#seas;
  }

  constructor() {
    super();

    this.#initializeLandProvinces();
    this.#initializeSeaProvinces();

    this.#connectUnitedKingdomProvinces();
    this.#connectBeneluxianProvinces();
    this.#connectFrenchProvinces();
    this.#connectIberianProvinces();
    this.#connectNorthAfricanProvinces();
    this.#connectScandinavianProvinces();
    this.#connectGermanProvinces();
    this.#connectItalianProvinces();
    this.#connectAustrianHungarianProvinces();
    this.#connectBalkanProvinces();
    this.#connectRussianProvinces();

    this.#connectSeaProvinces();

    this.#initializePorts();
  }
  #initializeLandProvinces() {
    this.#britishIsles = {};
    this.#frenchTerritories = {};
    this.#iberianPeninsula = {};
    this.#northAfrica = {};
    this.#beneluxCountries = {};
    this.#scandinavianCountries = {};
    this.#germanTerritories = {};
    this.#italianTerritories = {};
    this.#austrianHungarianTerritories = {};
    this.#balkanCountries = {};
    this.#russianTerritories = {};

    this.#britishIsles.Edinburgh = new Province('edinburgh');
    this.#britishIsles.Dublin = new Province('dublin');
    this.#britishIsles.Sheffield = new Province('sheffield');
    this.#britishIsles.Liverpool = new Province('liverpool');
    this.#britishIsles.London = new Province('london');

    this.#frenchTerritories.Brest = new Province('brest');
    this.#frenchTerritories.Bordeaux = new Province('bordeaux');
    this.#frenchTerritories.Marseille = new Province('marseille');
    this.#frenchTerritories.Paris = new Province('paris');
    this.#frenchTerritories.Dijon = new Province('dijon');

    this.#iberianPeninsula.Spain = new Province('spain');
    this.#iberianPeninsula.Portugal = new Province('portugal');

    this.#northAfrica.Morocco = new Province('morocco');
    this.#northAfrica.Algeria = new Province('algeria');
    this.#northAfrica.Tunis = new Province('tunis');

    this.#beneluxCountries.Holland = new Province('holland');
    this.#beneluxCountries.Belgium = new Province('belgium');

    this.#scandinavianCountries.Norway = new Province('norway');
    this.#scandinavianCountries.Sweden = new Province('sweden');
    this.#scandinavianCountries.Denmark = new Province('denmark');

    this.#germanTerritories.Hamburg = new Province('hamburg');
    this.#germanTerritories.Cologne = new Province('cologne');
    this.#germanTerritories.Munich = new Province('munich');
    this.#germanTerritories.Berlin = new Province('berlin');
    this.#germanTerritories.Danzig = new Province('danzig');

    this.#italianTerritories.Genoa = new Province('genoa');
    this.#italianTerritories.Venice = new Province('venice');
    this.#italianTerritories.Florence = new Province('florence');
    this.#italianTerritories.Rome = new Province('rome');
    this.#italianTerritories.Naples = new Province('naples');

    this.#austrianHungarianTerritories.Prague = new Province('prague');
    this.#austrianHungarianTerritories.Vienna = new Province('vienna');
    this.#austrianHungarianTerritories.Trieste = new Province('trieste');
    this.#austrianHungarianTerritories.Lemberg = new Province('lemberg');
    this.#austrianHungarianTerritories.Budapest = new Province('budapest');

    this.#balkanCountries.Romania = new Province('romania');
    this.#balkanCountries.WestBalkan = new Province('westbalkan');
    this.#balkanCountries.Bulgaria = new Province('bulgaria');
    this.#balkanCountries.Greece = new Province('greece');
    this.#balkanCountries.Turkey = new Province('turkey');

    this.#russianTerritories.StPetersburg = new Province('stpetersburg');
    this.#russianTerritories.Warsaw = new Province('warsaw');
    this.#russianTerritories.Moscow = new Province('moscow');
    this.#russianTerritories.Kiev = new Province('kiev');
    this.#russianTerritories.Odessa = new Province('odessa');

    const allLandRegions = [
      this.BritishIsles,
      this.BeneluxCountries,
      this.FrenchTerritories,
      this.NorthAfrica,
      this.IberianPeninsula,
      this.ScandinavianCountries,
      this.ItalianTerritories,
      this.AustrianHungarianTerritories,
      this.BalkanCountries,
      this.RussianTerritories,
    ];
    for (const landRegion of allLandRegions) {
      for (const landProvince of Object.values(landRegion)) {
        landProvince.isLand = true;
        this._addProvince(landProvince);
      }
    }
  }
  #initializeSeaProvinces() {
    this.#seas = {};

    this.#seas.NorthAtlantic = new Province('northatlantic');
    this.#seas.BayOfBiscay = new Province('bayofbiscay');
    this.#seas.NorthSea = new Province('northsea');
    this.#seas.EnglishChannel = new Province('englishchannel');
    this.#seas.WesternMediterranean = new Province('westernmediterraneansea');
    this.#seas.BalticSea = new Province('balticsea');
    this.#seas.IonianSea = new Province('ioniansea');
    this.#seas.EasternMediterranean = new Province('easternmediterraneansea');
    this.#seas.BlackSea = new Province('blacksea');

    for (const navalProvince of Object.values(this.#seas)) {
      navalProvince.isWater = true;
      this._addProvince(navalProvince);
    }
  }

  #connectUnitedKingdomProvinces() {
    this._connect(this.BritishIsles.Edinburgh, this.Seas.NorthAtlantic);
    this._connect(this.BritishIsles.Edinburgh, this.Seas.NorthSea);
    this._connect(this.BritishIsles.Edinburgh, this.BritishIsles.Liverpool);
    this._connect(this.BritishIsles.Edinburgh, this.BritishIsles.Sheffield);

    this._connect(this.BritishIsles.Dublin, this.Seas.NorthAtlantic);

    this._connect(this.BritishIsles.Liverpool, this.Seas.NorthAtlantic);
    this._connect(this.BritishIsles.Liverpool, this.BritishIsles.Sheffield);
    this._connect(this.BritishIsles.Liverpool, this.BritishIsles.London);

    this._connect(this.BritishIsles.Sheffield, this.Seas.NorthSea);
    this._connect(this.BritishIsles.Sheffield, this.BritishIsles.London);

    this._connect(this.BritishIsles.London, this.Seas.NorthAtlantic);
    this._connect(this.BritishIsles.London, this.Seas.NorthSea);
    this._connect(this.BritishIsles.London, this.Seas.EnglishChannel);
  }
  #connectFrenchProvinces() {
    this._connect(this.FrenchTerritories.Brest, this.Seas.EnglishChannel);
    this._connect(this.FrenchTerritories.Brest, this.Seas.BayOfBiscay);
    this._connect(this.FrenchTerritories.Brest, this.FrenchTerritories.Bordeaux);
    this._connect(this.FrenchTerritories.Brest, this.FrenchTerritories.Paris);
    this._connect(this.FrenchTerritories.Brest, this.FrenchTerritories.Dijon);

    this._connect(this.FrenchTerritories.Bordeaux, this.Seas.BayOfBiscay);
    this._connect(this.FrenchTerritories.Bordeaux, this.IberianPeninsula.Spain);
    this._connect(this.FrenchTerritories.Bordeaux, this.FrenchTerritories.Dijon);
    this._connect(this.FrenchTerritories.Bordeaux, this.FrenchTerritories.Marseille);

    this._connect(this.FrenchTerritories.Marseille, this.IberianPeninsula.Spain);
    this._connect(this.FrenchTerritories.Marseille, this.Seas.WesternMediterranean);
    this._connect(this.FrenchTerritories.Marseille, this.FrenchTerritories.Dijon);
    this._connect(this.FrenchTerritories.Marseille, this.ItalianTerritories.Genoa);

    this._connect(this.FrenchTerritories.Paris, this.Seas.EnglishChannel);
    this._connect(this.FrenchTerritories.Paris, this.BeneluxCountries.Belgium);
    this._connect(this.FrenchTerritories.Paris, this.FrenchTerritories.Dijon);

    this._connect(this.FrenchTerritories.Dijon, this.BeneluxCountries.Belgium);
    this._connect(this.FrenchTerritories.Dijon, this.GermanTerritories.Munich);
  }
  #connectIberianProvinces() {
    this._connect(this.IberianPeninsula.Portugal, this.IberianPeninsula.Spain);
    this._connect(this.IberianPeninsula.Portugal, this.Seas.BayOfBiscay);

    this._connect(this.IberianPeninsula.Spain, this.Seas.BayOfBiscay);
    this._connect(this.IberianPeninsula.Spain, this.FrenchTerritories.Bordeaux);
    this._connect(this.IberianPeninsula.Spain, this.FrenchTerritories.Marseille);
    this._connect(this.IberianPeninsula.Spain, this.Seas.WesternMediterranean);
  }
  #connectNorthAfricanProvinces() {
    this._connect(this.NorthAfrica.Morocco, this.Seas.BayOfBiscay);
    this._connect(this.NorthAfrica.Morocco, this.NorthAfrica.Algeria);

    this._connect(this.NorthAfrica.Algeria, this.Seas.WesternMediterranean);
    this._connect(this.NorthAfrica.Algeria, this.NorthAfrica.Tunis);

    this._connect(this.NorthAfrica.Tunis, this.Seas.WesternMediterranean);
    this._connect(this.NorthAfrica.Tunis, this.Seas.IonianSea);
  }
  #connectBeneluxianProvinces() {
    this._connect(this.BeneluxCountries.Belgium, this.Seas.EnglishChannel);
    this._connect(this.BeneluxCountries.Belgium, this.FrenchTerritories.Paris);
    this._connect(this.BeneluxCountries.Belgium, this.FrenchTerritories.Dijon);
    this._connect(this.BeneluxCountries.Belgium, this.BeneluxCountries.Holland);
    this._connect(this.BeneluxCountries.Belgium, this.GermanTerritories.Munich);
    this._connect(this.BeneluxCountries.Belgium, this.GermanTerritories.Cologne);

    this._connect(this.BeneluxCountries.Holland, this.Seas.EnglishChannel);
    this._connect(this.BeneluxCountries.Holland, this.Seas.NorthSea);
    this._connect(this.BeneluxCountries.Holland, this.GermanTerritories.Cologne);
    this._connect(this.BeneluxCountries.Holland, this.GermanTerritories.Hamburg);
  }
  #connectScandinavianProvinces() {
    this._connect(this.ScandinavianCountries.Norway, this.Seas.NorthSea);
    this._connect(this.ScandinavianCountries.Norway, this.Seas.BalticSea);
    this._connect(this.ScandinavianCountries.Norway, this.ScandinavianCountries.Denmark);
    this._connect(this.ScandinavianCountries.Norway, this.ScandinavianCountries.Sweden);

    this._connect(this.ScandinavianCountries.Denmark, this.Seas.NorthSea);
    this._connect(this.ScandinavianCountries.Denmark, this.Seas.BalticSea);
    this._connect(this.ScandinavianCountries.Denmark, this.GermanTerritories.Hamburg);

    this._connect(this.ScandinavianCountries.Sweden, this.Seas.BalticSea);
  }
  #connectGermanProvinces() {
    this._connect(this.GermanTerritories.Munich, this.FrenchTerritories.Dijon);
    this._connect(this.GermanTerritories.Munich, this.BeneluxCountries.Belgium);
    this._connect(this.GermanTerritories.Munich, this.GermanTerritories.Cologne);
    this._connect(this.GermanTerritories.Munich, this.GermanTerritories.Berlin);
    this._connect(this.GermanTerritories.Munich, this.AustrianHungarianTerritories.Vienna);
    this._connect(this.GermanTerritories.Munich, this.AustrianHungarianTerritories.Prague);

    this._connect(this.GermanTerritories.Cologne, this.BeneluxCountries.Belgium);
    this._connect(this.GermanTerritories.Cologne, this.BeneluxCountries.Holland);
    this._connect(this.GermanTerritories.Cologne, this.GermanTerritories.Hamburg);
    this._connect(this.GermanTerritories.Cologne, this.GermanTerritories.Berlin);

    this._connect(this.GermanTerritories.Hamburg, this.Seas.NorthSea);
    this._connect(this.GermanTerritories.Hamburg, this.Seas.BalticSea);
    this._connect(this.GermanTerritories.Hamburg, this.BeneluxCountries.Holland);
    this._connect(this.GermanTerritories.Hamburg, this.ScandinavianCountries.Denmark);
    this._connect(this.GermanTerritories.Hamburg, this.GermanTerritories.Berlin);

    this._connect(this.GermanTerritories.Berlin, this.Seas.BalticSea);
    this._connect(this.GermanTerritories.Berlin, this.AustrianHungarianTerritories.Prague);
    this._connect(this.GermanTerritories.Berlin, this.GermanTerritories.Danzig);

    this._connect(this.GermanTerritories.Danzig, this.Seas.BalticSea);
    this._connect(this.GermanTerritories.Danzig, this.AustrianHungarianTerritories.Prague);
    this._connect(this.GermanTerritories.Danzig, this.RussianTerritories.StPetersburg);
    this._connect(this.GermanTerritories.Danzig, this.RussianTerritories.Warsaw);
  }
  #connectItalianProvinces() {
    this._connect(this.ItalianTerritories.Genoa, this.Seas.WesternMediterranean);
    this._connect(this.ItalianTerritories.Genoa, this.FrenchTerritories.Marseille);
    this._connect(this.ItalianTerritories.Genoa, this.ItalianTerritories.Venice);
    this._connect(this.ItalianTerritories.Genoa, this.ItalianTerritories.Florence);

    this._connect(this.ItalianTerritories.Venice, this.Seas.IonianSea);
    this._connect(this.ItalianTerritories.Venice, this.AustrianHungarianTerritories.Vienna);
    this._connect(this.ItalianTerritories.Venice, this.AustrianHungarianTerritories.Trieste);
    this._connect(this.ItalianTerritories.Venice, this.ItalianTerritories.Florence);
    this._connect(this.ItalianTerritories.Venice, this.ItalianTerritories.Rome);

    this._connect(this.ItalianTerritories.Florence, this.Seas.WesternMediterranean);
    this._connect(this.ItalianTerritories.Florence, this.ItalianTerritories.Rome);

    this._connect(this.ItalianTerritories.Rome, this.Seas.WesternMediterranean);
    this._connect(this.ItalianTerritories.Rome, this.Seas.IonianSea);
    this._connect(this.ItalianTerritories.Rome, this.ItalianTerritories.Naples);

    this._connect(this.ItalianTerritories.Naples, this.Seas.WesternMediterranean);
    this._connect(this.ItalianTerritories.Naples, this.Seas.IonianSea);
  }
  #connectAustrianHungarianProvinces() {
    this._connect(this.AustrianHungarianTerritories.Vienna, this.GermanTerritories.Munich);
    this._connect(this.AustrianHungarianTerritories.Vienna, this.ItalianTerritories.Genoa);
    this._connect(this.AustrianHungarianTerritories.Vienna, this.ItalianTerritories.Venice);
    this._connect(this.AustrianHungarianTerritories.Vienna, this.AustrianHungarianTerritories.Prague);
    this._connect(this.AustrianHungarianTerritories.Vienna, this.AustrianHungarianTerritories.Trieste);
    this._connect(this.AustrianHungarianTerritories.Vienna, this.AustrianHungarianTerritories.Budapest);

    this._connect(this.AustrianHungarianTerritories.Prague, this.GermanTerritories.Munich);
    this._connect(this.AustrianHungarianTerritories.Prague, this.GermanTerritories.Berlin);
    this._connect(this.AustrianHungarianTerritories.Prague, this.GermanTerritories.Danzig);
    this._connect(this.AustrianHungarianTerritories.Prague, this.AustrianHungarianTerritories.Budapest);
    this._connect(this.AustrianHungarianTerritories.Prague, this.RussianTerritories.Warsaw);
    this._connect(this.AustrianHungarianTerritories.Prague, this.AustrianHungarianTerritories.Lemberg);

    this._connect(this.AustrianHungarianTerritories.Trieste, this.Seas.IonianSea);
    this._connect(this.AustrianHungarianTerritories.Trieste, this.ItalianTerritories.Venice);
    this._connect(this.AustrianHungarianTerritories.Trieste, this.AustrianHungarianTerritories.Budapest);
    this._connect(this.AustrianHungarianTerritories.Trieste, this.BalkanCountries.WestBalkan);

    this._connect(this.AustrianHungarianTerritories.Budapest, this.AustrianHungarianTerritories.Lemberg);
    this._connect(this.AustrianHungarianTerritories.Budapest, this.BalkanCountries.WestBalkan);
    this._connect(this.AustrianHungarianTerritories.Budapest, this.BalkanCountries.Romania);

    this._connect(this.AustrianHungarianTerritories.Lemberg, this.RussianTerritories.Warsaw);
    this._connect(this.AustrianHungarianTerritories.Lemberg, this.RussianTerritories.Kiev);
    this._connect(this.AustrianHungarianTerritories.Lemberg, this.BalkanCountries.Romania);
  }
  #connectBalkanProvinces() {
    this._connect(this.BalkanCountries.WestBalkan, this.Seas.IonianSea);
    this._connect(this.BalkanCountries.WestBalkan, this.AustrianHungarianTerritories.Trieste);
    this._connect(this.BalkanCountries.WestBalkan, this.AustrianHungarianTerritories.Budapest);
    this._connect(this.BalkanCountries.WestBalkan, this.BalkanCountries.Romania);
    this._connect(this.BalkanCountries.WestBalkan, this.BalkanCountries.Greece);
    this._connect(this.BalkanCountries.WestBalkan, this.BalkanCountries.Bulgaria);

    this._connect(this.BalkanCountries.Romania, this.Seas.BlackSea);
    this._connect(this.BalkanCountries.Romania, this.AustrianHungarianTerritories.Budapest);
    this._connect(this.BalkanCountries.Romania, this.AustrianHungarianTerritories.Lemberg);
    this._connect(this.BalkanCountries.Romania, this.RussianTerritories.Kiev);
    this._connect(this.BalkanCountries.Romania, this.BalkanCountries.Bulgaria);
    this._connect(this.BalkanCountries.Romania, this.RussianTerritories.Odessa);

    this._connect(this.BalkanCountries.Greece, this.Seas.IonianSea);
    this._connect(this.BalkanCountries.Greece, this.Seas.EasternMediterranean);
    this._connect(this.BalkanCountries.Greece, this.BalkanCountries.Bulgaria);

    this._connect(this.BalkanCountries.Bulgaria, this.Seas.EasternMediterranean);
    this._connect(this.BalkanCountries.Bulgaria, this.Seas.BlackSea);
    this._connect(this.BalkanCountries.Bulgaria, this.BalkanCountries.Turkey);

    this._connect(this.BalkanCountries.Turkey, this.Seas.EasternMediterranean);
    this._connect(this.BalkanCountries.Turkey, this.Seas.BlackSea);
  }
  #connectRussianProvinces() {
    this._connect(this.RussianTerritories.StPetersburg, this.Seas.BalticSea);
    this._connect(this.RussianTerritories.StPetersburg, this.GermanTerritories.Danzig);
    this._connect(this.RussianTerritories.StPetersburg, this.RussianTerritories.Warsaw);
    this._connect(this.RussianTerritories.StPetersburg, this.RussianTerritories.Moscow);

    this._connect(this.RussianTerritories.Warsaw, this.GermanTerritories.Danzig);
    this._connect(this.RussianTerritories.Warsaw, this.AustrianHungarianTerritories.Prague);
    this._connect(this.RussianTerritories.Warsaw, this.AustrianHungarianTerritories.Lemberg);
    this._connect(this.RussianTerritories.Warsaw, this.RussianTerritories.Moscow);
    this._connect(this.RussianTerritories.Warsaw, this.RussianTerritories.Kiev);

    this._connect(this.RussianTerritories.Moscow, this.RussianTerritories.Kiev);

    this._connect(this.RussianTerritories.Kiev, this.AustrianHungarianTerritories.Lemberg);
    this._connect(this.RussianTerritories.Kiev, this.BalkanCountries.Romania);
    this._connect(this.RussianTerritories.Kiev, this.RussianTerritories.Odessa);

    this._connect(this.RussianTerritories.Odessa, this.BalkanCountries.Romania);
    this._connect(this.RussianTerritories.Odessa, this.Seas.BlackSea);
  }

  #connectSeaProvinces() {
    this._connect(this.Seas.NorthAtlantic, this.Seas.BayOfBiscay);
    this._connect(this.Seas.NorthAtlantic, this.Seas.NorthSea);
    this._connect(this.Seas.NorthAtlantic, this.Seas.EnglishChannel);

    this._connect(this.Seas.BayOfBiscay, this.Seas.EnglishChannel);
    this._connect(this.Seas.BayOfBiscay, this.Seas.WesternMediterranean);

    this._connect(this.Seas.NorthSea, this.Seas.EnglishChannel);
    this._connect(this.Seas.NorthSea, this.Seas.BalticSea);

    // English Channel already completely connected

    this._connect(this.Seas.WesternMediterranean, this.Seas.IonianSea);

    // Baltic Sea already completely connected

    this._connect(this.Seas.IonianSea, this.Seas.EasternMediterranean);

    this._connect(this.Seas.EasternMediterranean, this.Seas.BlackSea);

    // Black Sea already completely connected
  }

  #initializePorts() {
    this.BritishIsles.Dublin.portEgress = this.Seas.NorthAtlantic;
    this.BritishIsles.Liverpool.portEgress = this.Seas.NorthAtlantic;
    this.BritishIsles.Edinburgh.portEgress = this.Seas.NorthSea;
    this.BritishIsles.London.portEgress = this.Seas.EnglishChannel;

    this.FrenchTerritories.Brest.portEgress = this.Seas.EnglishChannel;
    this.FrenchTerritories.Bordeaux.portEgress = this.Seas.BayOfBiscay;
    this.FrenchTerritories.Marseille.portEgress = this.Seas.WesternMediterranean;

    this.GermanTerritories.Hamburg.portEgress = this.Seas.NorthSea;
    this.GermanTerritories.Danzig.portEgress = this.Seas.BalticSea;

    this.ItalianTerritories.Genoa.portEgress = this.Seas.WesternMediterranean;
    this.ItalianTerritories.Venice.portEgress = this.Seas.IonianSea;
    this.ItalianTerritories.Naples.portEgress = this.Seas.WesternMediterranean;

    this.AustrianHungarianTerritories.Trieste.portEgress = this.Seas.IonianSea;

    this.RussianTerritories.StPetersburg.portEgress = this.Seas.BalticSea;
    this.RussianTerritories.Odessa.portEgress = this.Seas.BlackSea;
  }
}
