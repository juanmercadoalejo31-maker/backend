% Nivel bajo

evaluar_glucosa(G, "Baja") :-
    G < 70.

% Nivel normal

evaluar_glucosa(G, "Normal") :-
    G >= 70,
    G =< 180.

% Nivel alta

evaluar_glucosa(G, "Alta") :-
    G > 180.