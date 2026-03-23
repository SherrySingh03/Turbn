import React from 'react';
import LoadingIndicator from '../../components/LoadingIndicator';
import { getLoadingMessages, useStudioSession } from '../../context/StudioSessionContext';
import StudioHub from './StudioHub';
import UploadFlowScreen from './UploadFlowScreen';
import OutfitReviewScreen from './OutfitReviewScreen';
import ManualStudioScreen from './ManualStudioScreen';
import RecommendationsScreen from './RecommendationsScreen';
import ResultScreen from './ResultScreen';

const StudioStack: React.FC = () => {
    const { loadingState, language, studioPhase, t } = useStudioSession();

    if (loadingState) {
        return (
            <LoadingIndicator
                title={
                    loadingState === 'suggestions'
                        ? t('generatingSuggestionsTitle')
                        : t('generatingLookTitle')
                }
                messages={getLoadingMessages(loadingState, language)}
                statusLine={t('aiAnalyzingFabric')}
            />
        );
    }

    switch (studioPhase) {
        case 'hub':
            return <StudioHub />;
        case 'upload':
            return <UploadFlowScreen />;
        case 'outfitReview':
            return <OutfitReviewScreen />;
        case 'manual':
            return <ManualStudioScreen />;
        case 'recommendations':
            return <RecommendationsScreen />;
        case 'result':
            return <ResultScreen />;
        default:
            return <StudioHub />;
    }
};

export default StudioStack;
