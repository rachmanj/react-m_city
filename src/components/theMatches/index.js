import React, { useEffect, useState, useReducer } from 'react';
import { showErrorToast } from '../utils/tools';

import { CircularProgress } from '@material-ui/core';
import { matchesCollection } from '../../firebase';

import LeagueTable from './tables';
import MatchesList from './matchesList';

const TheMatches = () => {
  const [matches, setMatches] = useState(null);
  const [state, dispatch] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    {
      filterMatches: null,
      playedFilter: 'All',
      resultFilter: 'All',
    }
  );

  useEffect(() => {
    if (!matches) {
      matchesCollection
        .get()
        .then(snapshot => {
          const matches = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMatches(matches);
          dispatch({ ...state, filterMatches: matches });
        })
        .catch(error => {
          showErrorToast(error);
        });
    }
  }, [matches, state]);

  const showPlayed = played => {
    /// all, yes, no
    const list = matches.filter(match => {
      return match.final === played;
    });

    dispatch({
      ...state,
      filterMatches: played === 'all' ? matches : list,
      playedFilter: played,
      resultFilter: 'All',
    });
  };

  const showResult = result => {
    const list = matches.filter(match => {
      return match.result === result;
    });

    dispatch({
      ...state,
      filterMatches: result === 'All' ? matches : list,
      playedFilter: 'All',
      resultFilter: result,
    });
  };

  console.log(state.filterMatches);

  return (
    <>
      {matches ? (
        <div className="the_matches_container">
          <div className="the_matches_wrapper">
            <div className="left">
              <div className="match_filters">
                <div className="match_filters_box">
                  <div className="tag">Show Matches</div>
                  <div className="cont">
                    <div
                      className={`option ${
                        state.playedFilter === 'all' ? 'active' : ''
                      }`}
                      onClick={() => showPlayed('all')}
                    >
                      All
                    </div>
                    <div
                      className={`option ${
                        state.playedFilter === 'Yes' ? 'active' : ''
                      }`}
                      onClick={() => showPlayed('Yes')}
                    >
                      Played
                    </div>
                    <div
                      className={`option ${
                        state.playedFilter === 'No' ? 'active' : ''
                      }`}
                      onClick={() => showPlayed('No')}
                    >
                      Not Played
                    </div>
                  </div>
                </div>
                <div className="match_filters_box">
                  <div className="tag">Result Games</div>
                  <div className="cont">
                    <div
                      className={`option ${
                        state.resultFilter === 'All' ? 'active' : ''
                      }`}
                      onClick={() => showResult('All')}
                    >
                      All
                    </div>
                    <div
                      className={`option ${
                        state.resultFilter === 'W' ? 'active' : ''
                      }`}
                      onClick={() => showResult('W')}
                    >
                      W
                    </div>
                    <div
                      className={`option ${
                        state.resultFilter === 'L' ? 'active' : ''
                      }`}
                      onClick={() => showResult('L')}
                    >
                      L
                    </div>
                    <div
                      className={`option ${
                        state.resultFilter === 'D' ? 'active' : ''
                      }`}
                      onClick={() => showResult('D')}
                    >
                      D
                    </div>
                  </div>
                </div>
              </div>
              <MatchesList matches={state.filterMatches} />
            </div>
            <div className="right">
              <LeagueTable />
            </div>
          </div>
        </div>
      ) : (
        <div className="progress">
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export default TheMatches;
