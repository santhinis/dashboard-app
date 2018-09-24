export interface Fixture {
    match_id: string;
    game_id: string;
    selected:boolean;
    tournament: string;
    country: any;
    home_team_name: string;
    home_team_favorited: number;
    home_team_id: number;
    away_team_id: number;
    away_team_favorited: number;
    away_team_name: string;
    home_team_abbr: string;
    away_team_abbr: string;
    no_of_mkts_available: number;
    match_status: number;
    match_time: Date;
    goals_home: number;
    goals_away: number;
    match_notifications_enabled: number;
    match_odds: {
      market_type: string;
      question_identifier: string;
      outcomes: JSON[];
    };
    match_bet_status: string;
  }
  