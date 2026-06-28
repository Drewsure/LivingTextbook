import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Medal, Sparkles } from 'lucide-react';
import { api } from '@/App';
import { toast } from 'sonner';
import { translate } from '@/utils/translations';

export default function LeaderboardEntry({ gameId, gameTitle, score, onComplete, instructionLanguage = 'ja' }) {
  const [studentName, setStudentName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!studentName.trim()) {
      toast.error('Please enter your name!');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/leaderboard', {
        student_name: studentName,
        score,
        game_id: gameId,
        game_title: gameTitle
      });
      
      // Also update student progress
      await api.post('/student/progress/update', null, {
        params: {
          student_name: studentName,
          game_id: gameId,
          score: score,
          completed: true,
          time_spent: Math.floor(Math.random() * 180) + 60 // Placeholder time, should be passed in
        }
      });
      
      toast.success('Added to leaderboard!');
      onComplete();
    } catch (error) {
      toast.error('Failed to add to leaderboard');
    }
    setSubmitting(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-lg mx-auto mt-8'
    >
      <Card className='border-4 border-yellow-400 rounded-3xl shadow-2xl bg-gradient-to-br from-yellow-50 to-orange-50'>
        <CardHeader className='text-center'>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className='mx-auto mb-4'
          >
            <Trophy className='w-16 h-16 text-yellow-500' />
          </motion.div>
          <CardTitle className='text-3xl font-black text-orange-900'>
            {translate("Join the Leaderboard", instructionLanguage)}
          </CardTitle>
          <p className='text-lg text-orange-700 font-bold'>{translate("Enter your name", instructionLanguage)}</p>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-center p-6 bg-white rounded-2xl border-4 border-yellow-300'>
            <p className='text-6xl font-black text-yellow-600 mb-2'>{score}%</p>
            <p className='text-lg font-bold text-gray-600'>{translate("Your Score", instructionLanguage)}</p>
          </div>

          <Input
            type='text'
            placeholder={translate("Enter your name", instructionLanguage)}
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className='h-14 text-xl font-bold text-center border-4 border-yellow-300 rounded-2xl'
            maxLength={20}
            data-testid='leaderboard-name-input'
          />

          <Button
            onClick={handleSubmit}
            disabled={!studentName.trim() || submitting}
            className='w-full h-14 text-xl font-black rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-xl'
            data-testid='submit-leaderboard-button'
          >
            <Sparkles className='w-5 h-5 mr-2' />
            {submitting ? 'Submitting...' : translate("Add to Leaderboard", instructionLanguage)}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LeaderboardDisplay({ entries, currentScore, instructionLanguage = 'ja' }) {
  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className='w-8 h-8 text-yellow-500' />;
    if (index === 1) return <Medal className='w-8 h-8 text-gray-400' />;
    if (index === 2) return <Medal className='w-8 h-8 text-orange-600' />;
    return <Star className='w-6 h-6 text-violet-400' />;
  };

  const getRankColor = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400';
    if (index === 1) return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400';
    if (index === 2) return 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-400';
    return 'bg-white border-violet-200';
  };

  return (
    <div className='mt-8 max-w-2xl mx-auto'>
      <Card className='border-4 border-violet-300 rounded-3xl shadow-2xl'>
        <CardHeader className='bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-center rounded-t-2xl'>
          <CardTitle className='text-3xl font-black flex items-center justify-center gap-3'>
            <Trophy className='w-10 h-10' />
            {translate("Top 15 Players", instructionLanguage)}
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6 space-y-3'>
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-2xl border-4 ${getRankColor(index)} ${
                currentScore === entry.score ? 'ring-4 ring-green-400' : ''
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center justify-center w-12 h-12'>
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <p className='text-xl font-black text-violet-900'>
                      {index + 1}. {entry.student_name}
                    </p>
                    <p className='text-sm text-violet-600 font-bold'>
                      {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='text-3xl font-black text-violet-700'>
                  {entry.score}%
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
