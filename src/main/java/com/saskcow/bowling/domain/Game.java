package com.saskcow.bowling.domain;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of="id")
@ToString(exclude="teams")
public class Game {
    private @Id @GeneratedValue Long id;
    @ManyToOne
    private Rota rota;
    private LocalDateTime time;
    private String venue;
    @ManyToMany
    private List<Team> teams;

    public Game(Rota rota, LocalDateTime time, String venue, List<Team> teams) {
        this.rota = rota;
        this.time = time;
        this.venue = venue;
        this.teams = teams;
    }
}