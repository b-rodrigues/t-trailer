import {makeProject} from '@motion-canvas/core';
import intro from './scenes/intro?scene';
import pipelinesData from './scenes/pipelines-data?scene';
import pipelinesCompose from './scenes/pipelines-compose?scene';
import errorsExplain from './scenes/errors-explain?scene';
import dataManip from './scenes/data-manip?scene';

export default makeProject({
  scenes: [intro, pipelinesData, pipelinesCompose, errorsExplain, dataManip],
});
