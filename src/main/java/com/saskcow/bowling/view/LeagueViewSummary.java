package com.saskcow.bowling.view;

import com.saskcow.bowling.domain.League;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LeagueViewSummary {
    private Long id;
    private String name;


    public LeagueViewSummary(League league) {
        this.name = league.getName();
        this.id = league.getId();
    }
}
