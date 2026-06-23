import {makeProject} from '@motion-canvas/core';
import intro from './scenes/intro?scene';
import pipelinesData from './scenes/pipelines-data?scene';
import pipelinesQuery from './scenes/pipelines-query?scene';
import pipelinesErrors from './scenes/pipelines-errors?scene';
import pipelinesDebug from './scenes/pipelines-debug?scene';
import pipelinesCompose from './scenes/pipelines-compose?scene';
import errorsExplain from './scenes/errors-explain?scene';
import dataManip from './scenes/data-manip?scene';

export default makeProject({
  scenes: [intro, pipelinesData, pipelinesQuery, pipelinesErrors, pipelinesDebug, pipelinesCompose, errorsExplain, dataManip],
});
