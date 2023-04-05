<template>
  <v-container>
    <b class="text-xl">How to Play Imperial (A Brief and Incomplete Guide)</b>
    <div class="mt-5">
      <b class="text-lg">Introduction</b>
      <div class="ml-5 sm:ml-10">
        <p>
          <b>Imperial</b> is a board game in which you play as an investor in pre-World War I European imperial powers. Players own bonds in various nations and whoever owns the majority stake in a nation controls that nation.
        </p>
        <p>
          Each nation takes their turn to do one action on the <b>rondel</b>. Whoever happens to control that nation when it is the nation's turn is the person who decides what that nation will do on that turn. Countries gain <b>power points</b> (which are increased by building factories and conquering territory). The first nation to gain <b>25 power points</b> signals the end of the game. The winner of the game is determined by evaluating the bonds controlled by each player and calculating who has the most valuable portfolio. The <b>raw score</b> in the player cards represents the player's score, taking into acount only the bonds they control. For each of the player's bonds, the following calculation is made and added to the player's raw score:
        </p>
        <div class="text-center">
          (nation power points / 5) * bond number
        </div>
        <p>
          The bond number is the lefthand number on the bond. For determining the winner at the end of the game, each player's cash is added to their raw score to make up their total Victory Points.
        </p>
      </div>
      <b class="text-lg">The Game Turn</b>
      <div class="ml-5 sm:ml-10">
        <p>When a nation's turn occurs, the current controller of that nation is allowed to place the nation's flag on a rondel slot (the effects of which are detailed below). Moving around the rondel in a clockwise fashion, players are allowed to advance their nation's flag up to <b>3 slots</b> for free and each additional slot costs <b>2m per slot</b> beyond the free 3, up to 3 additional slots.</p>
        <b>Production</b>
        <p>
          Unoccupied factories produce a unit. <b>Blue</b> factories produce fleets and <b>black</b> factories produce armies.
        </p>
        <b>Factory</b>
        <p>
          Nation builds a factory for <b>5m</b>.
        </p>
        <b>Import</b>
        <p>
          Nation may purchase up to <b>3</b> units for <b>1m</b> each, to be placed anywhere in their home territory.
        </p>
        <b>Maneuver</b>
        <p>
          Units may move. Fleets must move first, followed by armies.
        </p>
        <div class="border rounded border-gray-400 p-2 mx-10">
          <b>Maneuver - Railroad Rule</b>
          <p class="mx-5">
            On a maneuver turn, an army may move inside their own home territory for free, in addition to being able to move to one adjacent land region. If a home province is occupied by a foreign power, the railroad network is not operational and armies may only move to one adjacent land region.
          </p>
          <b>Manuever - Convoy</b>
          <p class="mx-5">
            Armies may use fleets to cross ocean regions. One fleet may only convoy one army per turn.
          </p>
          <b>Maneuver - Fighting and Coexisting</b>
          <p class="mx-5">
            When moving into a region occupied by another power, you will be given a choice of either <b>fighting</b> or <b>coexisting</b>. If you fight, your unit and one of their units will be removed from the board. If you coexist, both units remain but the dot on the region will not change.
          </p>
          <b>Maneuver - Placing a Dot</b>
          <p class="mx-5">
            If a nation has the only units in a neutral region (ie, one which is not a home province of another nation), the neutral region will acquire a dot in the color representing that nation.
          </p>
        </div>
        <b>Investor</b>
        <p>
          Nation pays players interest, investor card holder receives <b>2m</b> and may purchase a bond, Swiss Banks may invest.
        </p>
        <b>Taxation</b>
        <p>
          Player receives tax (<b>2m</b> per unoccupied factory and <b>1m</b> per dot) from the nation. Power points are increased and nation receives tax, less soldiers' pay (<b>1m</b> per unit).
        </p>
      </div>
      <b class="text-lg">The Investor Card</b>
      <div class="ml-5 sm:ml-10">
        <p>
          The investor card rotates independently through the players as the game progresses. Each time the <b>Investor</b> rondel slot is landed on, the following steps are followed:
          <ol class="border rounded border-gray-400 p-2 mx-10">
            <li>
              1. <b>Interest payments are made</b>
              <p class="mx-5">
                Each player who owns a bond in the nation that landed on the <b>Investor</b> rondel slot is paid interest from the nation. The interest on a bond is the <b>left-hand number</b> on the bond card.
              </p>
            </li>
            <li>
              2. <b>Investor is activated</b>
              <p class="mx-5">
                The player who has the investor card is given <b>2m</b> and can purchas <b>one</b> bond. Bear in mind that it is possible to trade up a bond that you already own. Payments for bonds are taken from the player's cash and given to the nation's treasury.
              </p>
            </li>
            <li>
              3. <b>Swiss Bank</b>
              <p class="mx-5">
                If any players control <b>no nations</b>, then they represent a Swiss Bank and can purchase a bond, even if they do not have the investor card. After the Investor purchases a bond, the Swiss Banks will be allowed to purchase a bond. Then the investor card changes hands.
              </p>
            </li>
          </ol>
        </p>
        <p>If the investor rondel slot is passed-through by any nation, steps two and three above are triggered <b>after</b> the target rondel action is handled.</p>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  created() {
    document.title = 'How to Play - Imperial';
  },
};
</script>
