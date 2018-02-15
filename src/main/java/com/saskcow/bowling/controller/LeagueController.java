package com.saskcow.bowling.controller;

import com.saskcow.bowling.domain.League;
import com.saskcow.bowling.repository.LeagueRepository;
import com.saskcow.bowling.view.LeagueView;
import com.saskcow.bowling.view.LeagueViewSummary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Controller
public class LeagueController {

    private LeagueRepository repo;
//    private TeamRepository teamRepository;

    @Autowired
    public LeagueController(LeagueRepository repo){
        this.repo = repo;
    }

    @RequestMapping(value = "/api/league", method = RequestMethod.GET)
    public ResponseEntity<Iterable<LeagueViewSummary>> findLeagues() {
        List<LeagueViewSummary> leagues = new ArrayList<>();
        repo.findAll().
                forEach(league -> leagues.add(new LeagueViewSummary(league)));
        return ResponseEntity.ok(leagues);
    }

    @RequestMapping(value = "/api/league", method = RequestMethod.GET, params = "name")
    public ResponseEntity<Iterable<LeagueViewSummary>> findLeaguesByName(@RequestParam("name") String name) {
        List<LeagueViewSummary> leagues = new ArrayList<>();
        repo.findByNameContaining(name).
                forEach(league -> leagues.add(new LeagueViewSummary(league)));
        return ResponseEntity.ok(leagues);
    }

    @RequestMapping(value = "/api/league/{id}", method = RequestMethod.GET)
    public ResponseEntity<LeagueView> findLeague(@PathVariable("id") Long id) {
        League league = repo.findOne(id);
        LeagueView leagueView = new LeagueView(league);
        return ResponseEntity.ok(leagueView);
    }

    @RequestMapping(value = "/api/league", method = RequestMethod.POST)
    public ResponseEntity<?> saveLeague(@RequestBody League league) {
        if(league.getTeams() == null){
            league.setTeams(new LinkedList<>());
        }
        League savedLeague = repo.save(league);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(savedLeague.getId()).toUri();
        return ResponseEntity.created(location).build();
    }

    @RequestMapping(value = "/api/league/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Void> deleteLeague(@PathVariable("id") Long id) {
        try {
//            League league = repo.findOne(id);
            repo.delete(id);
//            league.getTeams().forEach();
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }


}