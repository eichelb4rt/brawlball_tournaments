import { gql, GraphQLClient } from "graphql-request";

export default class SmashWrapper {
    private static _instance: SmashWrapper;
    private readonly graphQLClient: GraphQLClient;

    private constructor() {
        this.graphQLClient = new GraphQLClient("https://api.smash.gg/gql/alpha", {
            headers: {
                authorization: `Bearer ${process.env.SMASHGG_TOKEN}`
            }
        });
    }

    public static get instance(): SmashWrapper {
        return this._instance || (this._instance = new this());
    }


    public async get_tournament(arg: any): Promise<SmashTournament> {
        if (!arg) throw TypeError("get_tournament arg is null or undefined");
        switch (typeof arg) {
            case "string": return this.get_tournament_by_slug(arg);
            case "number": return this.get_tournament_by_id(arg);
            default: throw TypeError("unknown argument type");
        }
    }

    private async get_tournament_by_slug(slug: string): Promise<SmashTournament> {
        const query = gql`
            query TournamentQuery($slug: String) {
                tournament(slug: $slug){
                    id
                    name
                    createdAt
                    slug
                    owner {
                        id
                    }
                    events {
                        id
                        name
                    }
                }
            }
        `

        const vars = {
            "slug": slug
        }

        const data = await this.graphQLClient.request(query, vars);
        return data.tournament;
    }

    private async get_tournament_by_id(id: number): Promise<SmashTournament> {
        const query = gql`
            query TournamentQuery($id: ID) {
                tournament(id: $id){
                    id
                    name
                    createdAt
                    slug
                    owner {
                        id
                    }
                    events {
                        id
                        name
                    }
                }
            }
        `

        const vars = {
            "id": id
        }

        const data = await this.graphQLClient.request(query, vars);
        return data.tournament;
    }
}

export interface SmashTournament {
    id: number
    addrState: string
    // # Admin-only view of admins for this tournament
    // #
    // # Arguments
    // # roles: Which roles to show
    // admins(roles: [String]): [User]
    city: string
    countryCode: string
    // When the tournament was created (unix timestamp)
    createdAt: number
    currency: string
    // When the tournament ends
    endAt: number
    // When does event registration close
    eventRegistrationClosesAt: number
    // # Arguments
    // # limit: [Not documented]
    // # filter: [Not documented]
    // events(limit: Int, filter: EventFilter): [Event]
    // TODO: better events
    events: SmashEvent[]
    // True if tournament has at least one offline event
    hasOfflineEvents: boolean
    hasOnlineEvents: boolean
    hashtag: string
    // # Arguments
    // # type: [Not documented]
    // images(type: String): [Image]
    // True if tournament has at least one online event
    isOnline: boolean
    // Is tournament registration open
    isRegistrationOpen: boolean
    lat: number
    // links: TournamentLinks
    lng: number
    mapsPlaceId: string
    // The tournament name
    name: string
    // Number of attendees including spectators, if public
    numAttendees: number
    // The user who created the tournament
    owner: SmashUser
    // # Paginated, queryable list of participants
    // #
    // # Arguments
    // # query: [Not documented]
    // # isAdmin: [Not documented]
    // participants(query: ParticipantPaginationQuery!, isAdmin: Boolean): ParticipantConnection
    postalCode: string
    primaryContact: string
    primaryContactType: string
    // # Publishing settings for this tournament
    // publishing: JSON
    // When does registration for the tournament end
    registrationClosesAt: number
    rules: string
    // The short slug used to form the url
    shortSlug: string
    // The slug used to form the url
    slug: string
    // When the tournament Starts
    startAt: number
    // State of the tournament, can be ActivityState::CREATED, ActivityState::ACTIVE,
    // or ActivityState::COMPLETED
    state: SmashActivityState
    // # Arguments
    // # page: [Not documented]
    // # perPage: [Not documented]
    // stations(page: Int, perPage: Int): StationsConnection
    // streamQueue: [StreamQueue]
    // streams: [Streams]
    // When is the team creation deadline
    teamCreationClosesAt: number
    // # Paginated, queryable list of teams
    // #
    // # Arguments
    // # query: [Not documented]
    // teams(query: TeamsPaginationQuery!): TeamConnection
    // The timezone of the tournament
    timezone: string
    // The type of tournament from TournamentType
    tournamentType: number
    // When the tournament was last modified (unix timestamp)
    updatedAt: number
    // # Build Tournament URL
    // #
    // # Arguments
    // # tab: Tournament tab to add to URL
    // # relative: Generate a relative URL. Defaults to true. Setting to
    // # false will generate an absolute URL
    // url(tab: String, relative: Boolean): String
    venueAddress: string
    venueName: string
    // # List of all waves in this tournament
    // waves: [Wave]
}

export interface SmashPlayer {
    id: number
    gamerTag: string
    prefix: string
    // # Most recent active & published rankings
    // #
    // # Arguments
    // # limit: [Not documented]
    // # videogameId: [Not documented]
    // rankings(limit: Int, videogameId: ID): [PlayerRank]
    // # Recent sets for this player.
    // #
    // # Arguments
    // # opponentId: Use this to get H2H history between two players
    // recentSets(
    // opponentId: ID
    // ): [Set] @deprecated( reason: "Use the sets field instead." )
    // # Set history for this player.
    // #
    // # Arguments
    // # page: [Not documented]
    // # perPage: [Not documented]
    // # filters: Supported filter options to filter down set results.
    // sets(page: Int, perPage: Int, filters: SetFilters): SetConnection
    user: SmashUser
}

export interface SmashUser {
    id: number
    // # Authorizations to external services (i.e. Twitch, Twitter)
    // #
    // # Arguments
    // # types: [Not documented]
    // authorizations(types: [SocialConnectionType]): [ProfileAuthorization]
    bio: string
    // Public facing user birthday that respects user publishing settings
    birthday: string
    // Uniquely identifying token for user. Same as the hashed part of the slug
    discriminator: string
    // # Events this user has competed in
    // #
    // # Arguments
    // # query: [Not documented]
    // events(query: UserEventsPaginationQuery): EventConnection
    genderPronoun: string
    // # Arguments
    // # type: [Not documented]
    // images(type: String): [Image]
    // # Leagues this user has competed in
    // #
    // # Arguments
    // # query: [Not documented]
    // leagues(query: UserLeaguesPaginationQuery): LeagueConnection
    // Public location info for this user
    location: SmashAddress
    // Public facing user name that respects user publishing settings
    name: string
    // player for user
    player: SmashPlayer
    slug: string
    // # Tournaments this user is organizing or competing in
    // #
    // # Arguments
    // # query: [Not documented]
    // tournaments(query: UserTournamentsPaginationQuery): TournamentConnection
}

export interface SmashAddress {
    id: number
    city: string
    country: string
    countryId: number
    state: string
    stateId: number
}

export interface SmashEvent {
    id: number
    // How long before the event start will the check-in end (in seconds)
    checkInBuffer: number
    // How long the event check-in will last (in seconds)
    checkInDuration: number
    // Whether check-in is enabled for this event
    checkInEnabled: boolean
    // When the event was created (unix timestamp)
    createdAt: number
    // Last date attendees are able to create teams for team events
    deckSubmissionDeadline: number
    // # Maximum number of participants each Entrant can have
    // entrantSizeMax: Int @deprecated( reason: "Migrate to teamRosterSize" )
    // # Minimum number of participants each Entrant can have
    // entrantSizeMin: Int @deprecated( reason: "Migrate to teamRosterSize" )
    // # The entrants that belong to an event, paginated by filter criteria
    // #
    // # Arguments
    // # query: [Not documented]
    // entrants(query: EventEntrantPageQuery): EntrantConnection
    // Whether the event has decks
    hasDecks: boolean
    // Are player tasks enabled for this event
    hasTasks: boolean
    // # Arguments
    // # type: [Not documented]
    // images(type: String): [Image]
    // Whether the event is an online event or not
    isOnline: boolean
    // league: League
    // Markdown field for match rules/instructions
    matchRulesMarkdown: string
    // Title of event set by organizer
    name: string
    // Gets the number of entrants in this event
    numEntrants: number
    // # The phase groups that belong to an event.
    // phaseGroups: [PhaseGroup]
    // # The phases that belong to an event.
    // #
    // # Arguments
    // # state: Filter phases by state. If not specified will default to
    // # all phases
    // # phaseId: Optionally only return results for this phase
    // phases(state: ActivityState, phaseId: ID): [Phase]
    // # TO settings for prizing
    // prizingInfo: JSON
    // publishing: JSON
    // Markdown field for event rules/instructions
    rulesMarkdown: string
    // Id of the event ruleset
    rulesetId: number
    // # Settings pulled from the event ruleset, if one exists
    // rulesetSettings: JSON @deprecated( reason: "Use ruleset" )
    // # Paginated sets for this Event
    // #
    // # Arguments
    // # page: [Not documented]
    // # perPage: [Not documented]
    // # sortType: How to sort these sets
    // # filters: Supported filter options to filter down set results.
    // sets(page: Int, perPage: Int, sortType: SetSortType, filters: SetFilters): SetConnection
    slug: string
    // # Paginated list of standings
    // #
    // # Arguments
    // # query: [Not documented]
    // standings(query: StandingPaginationQuery!): StandingConnection
    // When does this event start?
    startAt: number
    // The state of the Event.
    state: SmashActivityState
    // # Paginated stations on this event
    // #
    // # Arguments
    // # query: [Not documented]
    // stations(query: StationFilter): StationsConnection
    // Last date attendees are able to create teams for team events
    teamManagementDeadline: number
    // If this is a teams event, returns whether or not teams can set custom names
    teamNameAllowed: boolean
    // # Team roster size requirements
    // teamRosterSize: TeamRosterSize
    tournament: SmashTournament
    // The type of the event, whether an entrant will have one participant or multiple
    type: number
    // When the event was last modified (unix timestamp)
    updatedAt: number
    // Whether the event uses the new EventSeeds for seeding
    useEventSeeds: boolean
    // videogame: Videogame
    // # The waves being used by the event
    // #
    // # Arguments
    // # phaseId: Waves filtered by phaseId, returns all if not set.
    // waves(phaseId: ID): [Wave]
}

export enum SmashActivityState {
    CREATED,
    ACTIVE,
    COMPLETED
}