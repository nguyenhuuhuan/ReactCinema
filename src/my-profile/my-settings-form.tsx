import { useEffect } from 'react';
import { OnClick, useUpdate } from 'react-hook-core';
import { confirm, handleError, message, storage, UserAccount, useResource } from 'uione';
import { useGetMyProfileService, UserSettings } from './my-profile';

interface InternalState {
  settings: UserSettings;
}

const data: InternalState = {
  settings: {} as any
};
const user: UserAccount = JSON.parse(sessionStorage.getItem('authService')||'{}') as UserAccount;
export const MySettingsForm = () => {
  const service = useGetMyProfileService();
  const resource = useResource();
  // const service = useGetMyProfileService();
  const { state, setState, updateState } = useUpdate<InternalState>(data, 'settings');

  useEffect(() => {
    const id = storage.getUserId();
    service.getMySettings('XU3rkqafp').then(settings => {
      if (settings) {
        setState({ settings });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (e: OnClick) => {
    e.preventDefault();
    confirm(resource.msg_confirm_save, resource.confirm, () => {
      service.saveMySettings('XU3rkqafp', state.settings).then((res: number) => {
        const msg = res > 0 ? resource.success_save_my_settings : resource.fail_save_my_settings;
        message(msg);
      }).catch(handleError);
    }, resource.no, resource.yes);
  };

  return (
    <div className='view-container'>
      <form id='mySettingsForm' name='mySettingsForm' model-name='settings'>
        <header>
          <h2>{resource.my_settings}</h2>
        </header>
        <div className='row'>
          <section className='col s12 m12 l6'>
            <h4>{resource.user_settings_member_profile_preferences}</h4>
            <label className='switch-container'>
              <input type='checkbox'
                id='searchEnginesLinksToMyProfile'
                name='searchEnginesLinksToMyProfile'
                checked={state.settings.searchEnginesLinksToMyProfile}
                onChange={updateState} />
              {resource.user_settings_search_engines_links_to_my_profile}
            </label>
            <label className='switch-container'>
              <input type='checkbox'
                id='followingListPublicOnMyProfile'
                name='followingListPublicOnMyProfile'
                checked={state.settings.followingListPublicOnMyProfile}
                onChange={updateState} />
              {resource.user_settings_search_engines_links_to_my_profile}
            </label>
          </section>
          <section className='col s12 m12 l6'>
            <h4>{resource.user_settings_around_me_references}</h4>
            <label className='switch-container'>
              <input type='checkbox'
                id='showMyProfileInSpacesAroundMe'
                name='showMyProfileInSpacesAroundMe'
                checked={state.settings.showMyProfileInSpacesAroundMe}
                onChange={updateState} />
              {resource.user_settings_show_my_profile_in_spaces_around_me}
            </label>
            <label className='switch-container'>
              <input type='checkbox'
                id='showAroundMeResultsInMemberFeed'
                name='showAroundMeResultsInMemberFeed'
                checked={state.settings.showAroundMeResultsInMemberFeed}
                onChange={updateState} />
              {resource.user_settings_show_around_me_results_in_member_feed}
            </label>
          </section>
          <section className='col s12 m12 l6'>
            <h4>{resource.user_settings_notification_preferences}</h4>
            <label className='switch-container'>
              <input type='checkbox'
                id='notification'
                name='notification'
                checked={state.settings.notification}
                onChange={updateState} />
              {resource.user_settings_notifications}
            </label>
            <div className='checkbox-section'>
              {resource.user_settings_feed_updates}
              <div className='checkbox-group'>
                <label>
                  <input type='checkbox'
                    id='notifyFeedUpdates'
                    name='notifyFeedUpdates'
                    checked={state.settings.notifyFeedUpdates}
                    onChange={updateState}
                  />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailFeedUpdates'
                    name='emailFeedUpdates'
                    checked={state.settings.emailFeedUpdates}
                    onChange={updateState}
                  />
                  {resource.email}
                </label>
              </div>
            </div>
            <div className='checkbox-section'>
              {resource.user_settings_post_mentions}
              <div className='checkbox-group'>
                <label>
                  <input type='checkbox'
                    id='notifyPostMentions'
                    name='notifyPostMentions'
                    checked={state.settings.notifyPostMentions}
                    onChange={updateState} />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailPostMentions'
                    name='emailPostMentions'
                    checked={state.settings.emailPostMentions}
                    onChange={updateState} />
                  {resource.email}
                </label>
              </div>
            </div>
            <div className='checkbox-section'>
              {resource.user_settings_comments_of_your_posts}
              <div className='checkbox-group'>
                <label>
                  <input type='checkbox'
                    id='notifyCommentsOfYourPosts'
                    name='notifyCommentsOfYourPosts'
                    checked={state.settings.notifyCommentsOfYourPosts}
                    onChange={updateState} />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailCommentsOfYourPosts'
                    name='emailCommentsOfYourPosts'
                    checked={state.settings.emailCommentsOfYourPosts}
                    onChange={updateState} />
                  {resource.email}
                </label>
              </div>
            </div>
            <div className='checkbox-section'>
              {resource.user_settings_event_invitations}
              <div className='checkbox-group'>
                <label>
                  <input type='checkbox'
                    id='notifyEventInvitations'
                    name='notifyEventInvitations'
                    checked={state.settings.notifyEventInvitations}
                    onChange={updateState} />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailEventInvitations'
                    name='emailEventInvitations'
                    checked={state.settings.emailEventInvitations}
                    onChange={updateState} />
                  {resource.email}
                </label>
              </div>
            </div>
            <div className='checkbox-section'>
              {resource.user_settings_when_new_events_around}
              <div className='checkbox-group'>
                <label>
                  <input type='checkbox'
                    id='notifyWhenNewEventsAround'
                    name='notifyWhenNewEventsAround'
                    checked={state.settings.notifyWhenNewEventsAround}
                    onChange={updateState} />
                  {resource.notification}
                </label>
                <label>
                  <input type='checkbox'
                    id='emailWhenNewEventsAround'
                    name='emailWhenNewEventsAround'
                    checked={state.settings.emailWhenNewEventsAround}
                    onChange={updateState} />
                  {resource.email}
                </label>
              </div>
            </div>
          </section>
        </div>
        <footer>
          <button type='submit' id='btnSave' name='btnSave' onClick={save}>
            {resource.save}
          </button >
        </footer>
      </form>
    </div>
  );
};
