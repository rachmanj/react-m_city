import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../Hoc/AdminLayout';

import { playersCollection } from '../../../firebase';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@material-ui/core';
import { showSuccessToast, showErrorToast } from '../../utils/tools';

const AdminPlayers = () => {
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState(null);

  useEffect(() => {
    if (!players) {
      setLoading(true);
      playersCollection
        .limit(2)
        .get()
        .then(snapshot => {
          const lastVisible = snapshot.docs[snapshot.docs.length - 1];
          const players = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLastVisible(lastVisible);
          setPlayers(players);
        })
        .catch(error => {
          showErrorToast(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [players]);

  const loadMorePlayers = () => {
    if (lastVisible) {
      setLoading(true);
      playersCollection
        .startAfter(lastVisible)
        .limit(2)
        .get()
        .then(snapshot => {
          const lastVisible = snapshot.docs[snapshot.docs.length - 1];
          const newPlayers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLastVisible(lastVisible);
          setPlayers([...players, ...newPlayers]);
        })
        .catch(error => {
          showErrorToast(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      showErrorToast('nothing to load');
    }
  };

  return (
    <AdminLayout title="The Players">
      <div className="mb-5">
        <Button
          disableElevation
          variant="outlined"
          component={Link}
          to={'/admin_players/add_player'}
        >
          Add Player
        </Button>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Number</TableCell>
                <TableCell>Position</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players
                ? players.map((player, i) => (
                    <TableRow>
                      <TableCell>
                        <Link to={`/admin_players/edit_player/${player.id}`}>
                          {player.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/admin_players/edit_player/${player.id}`}>
                          {player.lastname}
                        </Link>
                      </TableCell>
                      <TableCell>{player.number}</TableCell>
                      <TableCell>{player.position}</TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </Paper>
      </div>
      <Button
        variant="contained"
        color="primary"
        disabled={loading}
        onClick={() => loadMorePlayers()}
      >
        Load more
      </Button>
      <div className="admin_progress">
        {loading ? (
          <CircularProgress thickness={7} style={{ color: '#98c5e9' }} />
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminPlayers;
