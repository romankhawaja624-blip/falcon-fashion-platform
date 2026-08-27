import React from 'react';
import { useParams } from 'react-router-dom';
import { AudienceCollection } from '../../components/collections/AudienceCollection';

export const AudienceCollectionPage: React.FC = () => {
  const { audience } = useParams<{ audience: string }>();
  return <AudienceCollection audience={audience!} />;
};
