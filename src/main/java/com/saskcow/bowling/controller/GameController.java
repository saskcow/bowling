package com.saskcow.bowling.controller;

import com.saskcow.bowling.domain.Game;
import com.saskcow.bowling.domain.Team;
import com.saskcow.bowling.repository.GameRepository;
import com.saskcow.bowling.repository.TeamRepository;
import com.saskcow.bowling.rest.GameRest;
import com.saskcow.bowling.view.GameView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

@Controller
public class GameController {
    private GameRepository repo;
    private TeamRepository teamRepository;

    @Autowired
    public GameController(GameRepository repo, TeamRepository teamRepository){
        this.repo = repo;
        this.teamRepository = teamRepository;
    }

    @RequestMapping(value = "/api/game/{id}", method = RequestMethod.GET)
    public ResponseEntity<GameView> findLeague(@PathVariable("id") Long id) {
        Game game = repo.findOne(id);
        GameView gameView = new GameView(game);
        return ResponseEntity.ok(gameView);
    }

    @RequestMapping(value = "/api/game", method = RequestMethod.POST)
    public ResponseEntity<?> saveLeague(@RequestBody GameRest game) {
        Team team1 = teamRepository.findOne(game.getTeamId1());
        Team team2 = teamRepository.findOne(game.getTeamId2());
        List<Team> teams = new LinkedList<>(Arrays.asList(team1, team2));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime dateTime = LocalDateTime.parse(game.getTime(), formatter);
        Game savedGame = repo.save(new Game(dateTime, game.getVenue(), teams));
        team1.addGame(savedGame);
        team2.addGame(savedGame);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(savedGame.getId()).toUri();
        return ResponseEntity.created(location).build();
    }

    @RequestMapping(value = "/api/game/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> deleteLeague(@PathVariable("id") Long id) {
        try {
            Game game = repo.findOne(id);
            game.getTeams().forEach(team -> team.deleteGame(game));
            repo.delete(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}