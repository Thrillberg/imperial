<template>
  <v-card-text>
    <p class="text-h6">
      Introduction
    </p>
    <p>
      <b>Imperial</b> is a board game in which you play as an investor in imperial powers.
      Players own bonds in various nations and whoever owns the majority stake in a nation controls the actions of that nation.
    </p>
    <br>
    <p>
      Each nation takes its turn to do one action on the <b>rondel</b>.
      Whoever happens to control that nation when it is the nation's turn is the
      person who decides what that nation will do on that turn.
      Nations gain <b>power points</b> (which are increased by building factories and occupying territory).
      The first nation to gain <b>25 power points</b> signals the end of the game.
      The winner of the game is determined by evaluating the bonds controlled by each player and
      calculating who has the most valuable portfolio.
      A player's cash is also counted toward the final score.
    </p>
    <br>
    <p class="text-h6">
      The Game Turn
    </p>
    <p>
      When a nation's turn occurs, the current controller of that nation is allowed to place the
      nation's marker on a rondel slot (the effects of which are detailed below).
      Moving around the rondel in a clockwise fashion, players are allowed to advance their nation's marker
      up to <b>3 slots</b> for free and each additional slot costs the player <b>2m per slot</b> beyond the free 3,
      up to 3 additional slots. Costs in <b>Imperial 2030</b> and <b>Imperial Asia</b> vary.
    </p>
    <br>
    <b>
      Production
    </b>
    <p>
      Unoccupied factories produce a unit. <b>Blue</b> factories produce fleets and <b>black</b> factories produce armies.
    </p>
    <b>
      Factory
    </b>
    <p>
      Nation builds a factory for <b>5m</b>.
    </p>
    <b>
      Import
    </b>
    <p>
      Nation may purchase up to <b>3</b> units for <b>1m</b> each, to be placed anywhere in their home territory.
    </p>
    <b>
      Maneuver
    </b>
    <p>
      Units may move. Fleets must move first, followed by armies.
    </p>
    <v-card>
      <v-card-subtitle>Railroad Rule</v-card-subtitle>
      <v-card-text>
        On a maneuver turn, an army may move inside their own home territory for free,
        in addition to being able to move to one adjacent land region.
        If a home province is occupied by a foreign power, the railroad network is not operational
        in that province and armies may not move through that province for free.
      </v-card-text>
      <v-card-subtitle>Convoy</v-card-subtitle>
      <v-card-text>
        Armies may use fleets to cross ocean regions. One fleet may only convoy one army per turn.
      </v-card-text>
      <v-card-subtitle>Fighting and Coexisting</v-card-subtitle>
      <v-card-text>
        When moving into a region occupied by another power, you will be given a choice of either
        <b>fighting</b> or <b>coexisting</b>. If you fight, your unit and one of their units
        will be removed from the board. If you coexist (and the other player coexists), both units remain but the dot on the
        region will not change.
      </v-card-text>
      <v-card-subtitle>Placing a Dot</v-card-subtitle>
      <v-card-text>
        If a nation has the only units in a neutral region (ie, one which is not a home province of
        another nation), the neutral region will acquire a dot in the color representing that nation.
      </v-card-text>
    </v-card>
    <b>
      Investor
    </b>
    <p>
      Nation pays players interest, investor card holder receives <b>2m</b> and may purchase a bond,
      Swiss Banks may invest.
    </p>
    <b>
      Taxation
    </b>
    <p>
      Player receives tax (<b>2m</b> per unoccupied factory and <b>1m</b> per dot) from the nation.
      Power points are increased and nation receives tax, less soldiers' pay (<b>1m</b> per unit).
    </p>
    <br>
    <p class="text-h6">
      The Investor Card
    </p>
    <p>
      The investor card rotates independently through the players as the game progresses.
      Each time the <b>Investor</b> rondel slot is landed on, the following steps are followed:
    </p>
    <v-card>
      <v-card-text>
        <ol>
          <li>
            <b>Interest payments are made</b>
            <p>
              Each player who owns a bond in the nation that landed on the <b>Investor</b> rondel slot
              is paid interest from the nation. The interest on a bond is the <b>left-hand number</b>
              on the bond card.
            </p>
          </li>
          <li>
            <b>Investor is activated</b>
            <p>
              The player who has the investor card is given <b>2m</b> and can purchase <b>one</b> bond.
              Bear in mind that it is possible to trade up a bond that you already own.
              Payments for bonds are taken from the player's cash and given to the nation's treasury.
            </p>
          </li>
          <li>
            <b>Swiss Bank</b>
            <p>
              If any players control <b>no nations</b>, then they represent a Swiss Bank and can purchase
              a bond, even if they do not have the investor card.
              After the Investor purchases a bond, the Swiss Banks will be allowed to purchase a bond.
              Then the investor card changes hands.
            </p>
          </li>
        </ol>
      </v-card-text>
    </v-card>
    <p>
      If the investor rondel slot is passed-through by any nation, steps two and three above
      are triggered <b>after</b> the target rondel action is handled.
    </p>
  </v-card-text>
</template>
